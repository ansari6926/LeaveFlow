import { getDb, saveDb } from '../db.js';

// Helper to calculate total days between start and end date (inclusive)
export function calculateDaysCount(startDateStr, endDateStr, durationType = 'FULL_DAY') {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format provided.');
  }
  
  if (start > end) {
    throw new Error('Start date cannot be after end date.');
  }

  // Calculate day difference (inclusive of both start and end date)
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (durationType === 'FIRST_HALF' || durationType === 'SECOND_HALF') {
    if (diffDays > 1) {
      throw new Error('Half-day leave can only be requested for a single date.');
    }
    return 0.5;
  }

  return diffDays;
}

// Check for date range overlaps between requests
export function checkOverlap(existingRequests, userId, startDateStr, endDateStr, durationType = 'FULL_DAY') {
  const newStart = new Date(startDateStr);
  const newEnd = new Date(endDateStr);

  const activeUserRequests = existingRequests.filter(req => 
    req.userId === userId && (req.status === 'PENDING' || req.status === 'APPROVED')
  );

  for (const req of activeUserRequests) {
    const exStart = new Date(req.startDate);
    const exEnd = new Date(req.endDate);

    // Overlap condition: (StartA <= EndB) and (EndA >= StartB)
    if (newStart <= exEnd && newEnd >= exStart) {
      // If dates overlap, check half-day granularity
      const isSameSingleDay = startDateStr === endDateStr && req.startDate === req.endDate && req.startDate === startDateStr;
      if (isSameSingleDay) {
        // If both are half-days on the exact same date
        const isNewHalf = durationType === 'FIRST_HALF' || durationType === 'SECOND_HALF';
        const isExHalf = req.durationType === 'FIRST_HALF' || req.durationType === 'SECOND_HALF';

        if (isNewHalf && isExHalf) {
          // Opposite half days do not conflict! (First Half & Second Half on same day)
          if (durationType !== req.durationType) {
            continue; // No overlap error
          }
        }
      }
      return {
        hasOverlap: true,
        conflictingRequest: req
      };
    }
  }

  return { hasOverlap: false };
}

// Global flag to toggle deliberate Red Run bug (for testing assessment requirements)
export let DELIBERATE_RED_RUN_BUG = false;

export function setDeliberateRedRunBug(val) {
  DELIBERATE_RED_RUN_BUG = val;
}

export function submitLeaveRequest({ userId, leaveType, startDate, endDate, durationType = 'FULL_DAY', reason }) {
  if (!userId || !leaveType || !startDate || !endDate || !reason) {
    throw new Error('All required fields (leaveType, startDate, endDate, reason) must be provided.');
  }

  const validTypes = ['ANNUAL', 'CASUAL', 'SICK'];
  if (!validTypes.includes(leaveType)) {
    throw new Error(`Invalid leave type: ${leaveType}. Must be one of ${validTypes.join(', ')}.`);
  }

  const db = getDb();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found.');
  }

  // 1. Calculate days
  const daysCount = calculateDaysCount(startDate, endDate, durationType);
  if (daysCount <= 0) {
    throw new Error('Leave duration must be greater than zero.');
  }

  // 2. Check balance
  const balance = user.balances[leaveType];
  if (!balance) {
    throw new Error(`No balance found for leave type ${leaveType}.`);
  }

  if (daysCount > balance.available) {
    throw new Error(`Insufficient ${leaveType} leave balance. Requested ${daysCount} day(s), but only ${balance.available} day(s) available.`);
  }

  // 3. Check overlaps
  const overlapCheck = checkOverlap(db.leaveRequests, userId, startDate, endDate, durationType);
  if (overlapCheck.hasOverlap) {
    const conf = overlapCheck.conflictingRequest;
    throw new Error(`Overlapping leave request detected with existing ${conf.status.toLowerCase()} request (${conf.startDate} to ${conf.endDate}, ${conf.durationType}).`);
  }

  const newRequest = {
    id: `req_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    leaveType,
    startDate,
    endDate,
    durationType,
    daysCount,
    reason: reason.trim(),
    status: 'PENDING',
    rejectionReason: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: new Date().toISOString()
  };

  db.leaveRequests.unshift(newRequest);
  saveDb(db);

  return newRequest;
}

export function approveLeaveRequest(requestId, managerUser) {
  if (managerUser.role !== 'MANAGER') {
    throw new Error('Unauthorized: Only managers can approve leave requests.');
  }

  const db = getDb();
  const request = db.leaveRequests.find(r => r.id === requestId);
  if (!request) {
    throw new Error('Leave request not found.');
  }

  // Self-approval rule
  if (request.userId === managerUser.id) {
    throw new Error('Self-approval forbidden: Managers cannot approve their own leave requests.');
  }

  // Immutable request state check
  if (request.status !== 'PENDING') {
    throw new Error(`Cannot approve request: Request is already ${request.status}.`);
  }

  const employee = db.users.find(u => u.id === request.userId);
  if (!employee) {
    throw new Error('Associated employee not found.');
  }

  const userBalance = employee.balances[request.leaveType];
  if (request.daysCount > userBalance.available) {
    throw new Error(`Cannot approve: Employee now has insufficient ${request.leaveType} balance (${userBalance.available} available).`);
  }

  // Update status & balance
  request.status = 'APPROVED';
  request.reviewedBy = managerUser.name;
  request.reviewedAt = new Date().toISOString();

  if (DELIBERATE_RED_RUN_BUG) {
    // Controlled Bug for Red Run: FAIL to update/deduct balance upon approval!
    console.warn('[RED RUN BUG ACTIVE]: Skipping balance deduction!');
  } else {
    // Normal Correct Implementation: Update balance
    userBalance.used += request.daysCount;
    userBalance.available = userBalance.total - userBalance.used;
  }

  saveDb(db);
  return { request, updatedBalance: userBalance };
}

export function rejectLeaveRequest(requestId, managerUser, rejectionReason) {
  if (managerUser.role !== 'MANAGER') {
    throw new Error('Unauthorized: Only managers can reject leave requests.');
  }

  if (!rejectionReason || !rejectionReason.trim()) {
    throw new Error('Rejection reason is mandatory when rejecting a leave request.');
  }

  const db = getDb();
  const request = db.leaveRequests.find(r => r.id === requestId);
  if (!request) {
    throw new Error('Leave request not found.');
  }

  if (request.status !== 'PENDING') {
    throw new Error(`Cannot reject request: Request is already ${request.status}.`);
  }

  request.status = 'REJECTED';
  request.rejectionReason = rejectionReason.trim();
  request.reviewedBy = managerUser.name;
  request.reviewedAt = new Date().toISOString();

  saveDb(db);
  return request;
}
