import { describe, it, expect, beforeEach } from 'vitest';
import { getDb, resetDb } from '../../backend/src/db.js';
import { 
  submitLeaveRequest, 
  approveLeaveRequest, 
  rejectLeaveRequest, 
  calculateDaysCount, 
  checkOverlap,
  setDeliberateRedRunBug
} from '../../backend/src/services/leaveService.js';

describe('LeaveFlow Business Rules & Integration Test Suite', () => {
  beforeEach(() => {
    resetDb();
    setDeliberateRedRunBug(false);
  });

  // ===================================================
  // 1. NORMAL PATHS
  // ===================================================
  describe('Normal Workflow Paths', () => {
    it('1.1 Should successfully submit a valid annual leave request', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');

      const request = submitLeaveRequest({
        userId: employee.id,
        leaveType: 'ANNUAL',
        startDate: '2026-10-01',
        endDate: '2026-10-03',
        durationType: 'FULL_DAY',
        reason: 'Vacation trip'
      });

      expect(request).toBeDefined();
      expect(request.status).toBe('PENDING');
      expect(request.daysCount).toBe(3);
      expect(request.leaveType).toBe('ANNUAL');
    });

    it('1.2 Should successfully approve a pending leave request and update employee balance', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');
      const manager = db.users.find(u => u.role === 'MANAGER');

      const initialAvailable = employee.balances.ANNUAL.available;

      const req = submitLeaveRequest({
        userId: employee.id,
        leaveType: 'ANNUAL',
        startDate: '2026-10-10',
        endDate: '2026-10-11',
        durationType: 'FULL_DAY',
        reason: 'Family event'
      });

      const { request: approvedReq, updatedBalance } = approveLeaveRequest(req.id, manager);

      expect(approvedReq.status).toBe('APPROVED');
      expect(approvedReq.reviewedBy).toBe(manager.name);
      expect(updatedBalance.available).toBe(initialAvailable - 2);
      expect(updatedBalance.used).toBe(5); // Initial 3 + 2 approved = 5
    });

    it('1.3 Should successfully reject a pending leave request with a mandatory reason', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');
      const manager = db.users.find(u => u.role === 'MANAGER');

      const req = submitLeaveRequest({
        userId: employee.id,
        leaveType: 'CASUAL',
        startDate: '2026-10-20',
        endDate: '2026-10-20',
        durationType: 'FULL_DAY',
        reason: 'Personal work'
      });

      const rejectedReq = rejectLeaveRequest(req.id, manager, 'High project deadline deliverables week.');

      expect(rejectedReq.status).toBe('REJECTED');
      expect(rejectedReq.rejectionReason).toBe('High project deadline deliverables week.');
      expect(rejectedReq.reviewedBy).toBe(manager.name);
    });
  });

  // ===================================================
  // 2. INVALID INPUTS
  // ===================================================
  describe('Invalid Input Validation', () => {
    it('2.1 Should throw error when start date is after end date', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');

      expect(() => {
        submitLeaveRequest({
          userId: employee.id,
          leaveType: 'ANNUAL',
          startDate: '2026-10-15',
          endDate: '2026-10-10',
          durationType: 'FULL_DAY',
          reason: 'Invalid dates test'
        });
      }).toThrow('Start date cannot be after end date.');
    });

    it('2.2 Should throw error when leave request exceeds available balance', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');
      const available = employee.balances.CASUAL.available; // 6 days

      expect(() => {
        submitLeaveRequest({
          userId: employee.id,
          leaveType: 'CASUAL',
          startDate: '2026-11-01',
          endDate: '2026-11-10', // 10 days requested > 6 available
          durationType: 'FULL_DAY',
          reason: 'Extended leave exceeding limit'
        });
      }).toThrow(/Insufficient CASUAL leave balance/);
    });

    it('2.3 Should throw error when required fields are missing', () => {
      expect(() => {
        submitLeaveRequest({
          userId: 'usr_emp1',
          leaveType: 'ANNUAL',
          startDate: '',
          endDate: '2026-10-05',
          reason: ''
        });
      }).toThrow('All required fields (leaveType, startDate, endDate, reason) must be provided.');
    });

    it('2.4 Should throw error when rejecting without a rejection reason', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');
      const manager = db.users.find(u => u.role === 'MANAGER');

      const req = submitLeaveRequest({
        userId: employee.id,
        leaveType: 'SICK',
        startDate: '2026-10-25',
        endDate: '2026-10-25',
        durationType: 'FULL_DAY',
        reason: 'Dentist appointment'
      });

      expect(() => {
        rejectLeaveRequest(req.id, manager, '');
      }).toThrow('Rejection reason is mandatory when rejecting a leave request.');
    });

    it('2.5 Should throw error when non-manager attempts to approve request', () => {
      const db = getDb();
      const employee1 = db.users.find(u => u.id === 'usr_emp1');
      const employee2 = db.users.find(u => u.id === 'usr_emp2');

      const req = submitLeaveRequest({
        userId: employee1.id,
        leaveType: 'ANNUAL',
        startDate: '2026-11-15',
        endDate: '2026-11-16',
        durationType: 'FULL_DAY',
        reason: 'Rest'
      });

      expect(() => {
        approveLeaveRequest(req.id, employee2); // Non-manager role
      }).toThrow('Unauthorized: Only managers can approve leave requests.');
    });
  });

  // ===================================================
  // 3. EDGE CASES
  // ===================================================
  describe('Edge Cases & Security Guards', () => {
    it('3.1 Should reject overlapping leave requests for the same employee', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');

      // First request: Oct 5 to Oct 8
      submitLeaveRequest({
        userId: employee.id,
        leaveType: 'ANNUAL',
        startDate: '2026-10-05',
        endDate: '2026-10-08',
        durationType: 'FULL_DAY',
        reason: 'Vacation part 1'
      });

      // Overlapping second request: Oct 7 to Oct 10
      expect(() => {
        submitLeaveRequest({
          userId: employee.id,
          leaveType: 'CASUAL',
          startDate: '2026-10-07',
          endDate: '2026-10-10',
          durationType: 'FULL_DAY',
          reason: 'Vacation part 2 overlap'
        });
      }).toThrow(/Overlapping leave request detected/);
    });

    it('3.2 Should prevent approving an already approved request (State Immutability)', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');
      const manager = db.users.find(u => u.role === 'MANAGER');

      const req = submitLeaveRequest({
        userId: employee.id,
        leaveType: 'SICK',
        startDate: '2026-11-20',
        endDate: '2026-11-20',
        durationType: 'FULL_DAY',
        reason: 'Medical'
      });

      approveLeaveRequest(req.id, manager);

      // Attempt to re-approve
      expect(() => {
        approveLeaveRequest(req.id, manager);
      }).toThrow(/Request is already APPROVED/);
    });

    it('3.3 Should prevent manager self-approval', () => {
      const db = getDb();
      const manager = db.users.find(u => u.role === 'MANAGER');

      // Manager submits leave request for self
      const req = submitLeaveRequest({
        userId: manager.id,
        leaveType: 'ANNUAL',
        startDate: '2026-12-01',
        endDate: '2026-12-02',
        durationType: 'FULL_DAY',
        reason: 'Manager vacation'
      });

      // Manager attempts self-approval
      expect(() => {
        approveLeaveRequest(req.id, manager);
      }).toThrow('Self-approval forbidden: Managers cannot approve their own leave requests.');
    });
  });

  // ===================================================
  // 4. AI CHANGE LOOP: HALF-DAY LEAVE FEATURE TESTS
  // ===================================================
  describe('Half-Day Leave Feature (AI Change Loop)', () => {
    it('4.1 Should correctly calculate 0.5 days for First Half and Second Half requests', () => {
      expect(calculateDaysCount('2026-10-10', '2026-10-10', 'FIRST_HALF')).toBe(0.5);
      expect(calculateDaysCount('2026-10-10', '2026-10-10', 'SECOND_HALF')).toBe(0.5);
      expect(calculateDaysCount('2026-10-10', '2026-10-10', 'FULL_DAY')).toBe(1.0);
    });

    it('4.2 Should allow First Half and Second Half requests on the same date without overlap conflict', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');

      // Morning half day
      submitLeaveRequest({
        userId: employee.id,
        leaveType: 'CASUAL',
        startDate: '2026-10-15',
        endDate: '2026-10-15',
        durationType: 'FIRST_HALF',
        reason: 'Morning medical checkup'
      });

      // Afternoon half day - Should NOT throw overlap error!
      const afternoonReq = submitLeaveRequest({
        userId: employee.id,
        leaveType: 'CASUAL',
        startDate: '2026-10-15',
        endDate: '2026-10-15',
        durationType: 'SECOND_HALF',
        reason: 'Afternoon car service'
      });

      expect(afternoonReq).toBeDefined();
      expect(afternoonReq.daysCount).toBe(0.5);
      expect(afternoonReq.durationType).toBe('SECOND_HALF');
    });

    it('4.3 Should reject conflicting same-half or full-day overlaps on the same date', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');

      // Morning half day
      submitLeaveRequest({
        userId: employee.id,
        leaveType: 'CASUAL',
        startDate: '2026-10-16',
        endDate: '2026-10-16',
        durationType: 'FIRST_HALF',
        reason: 'Morning event'
      });

      // Duplicate Morning half day - SHOULD THROW
      expect(() => {
        submitLeaveRequest({
          userId: employee.id,
          leaveType: 'CASUAL',
          startDate: '2026-10-16',
          endDate: '2026-10-16',
          durationType: 'FIRST_HALF',
          reason: 'Duplicate morning event'
        });
      }).toThrow(/Overlapping leave request detected/);

      // Full Day on same date - SHOULD THROW
      expect(() => {
        submitLeaveRequest({
          userId: employee.id,
          leaveType: 'ANNUAL',
          startDate: '2026-10-16',
          endDate: '2026-10-16',
          durationType: 'FULL_DAY',
          reason: 'Full day conflict'
        });
      }).toThrow(/Overlapping leave request detected/);
    });
  });

  // ===================================================
  // 5. RED RUN DELIBERATE BUG DETECTION TEST
  // ===================================================
  describe('Red Run Controlled Bug Detection', () => {
    it('5.1 Must detect failure when DELIBERATE_RED_RUN_BUG is activated', () => {
      const db = getDb();
      const employee = db.users.find(u => u.role === 'EMPLOYEE');
      const manager = db.users.find(u => u.role === 'MANAGER');

      const initialAvailable = employee.balances.ANNUAL.available;

      const req = submitLeaveRequest({
        userId: employee.id,
        leaveType: 'ANNUAL',
        startDate: '2026-12-10',
        endDate: '2026-12-12', // 3 days
        durationType: 'FULL_DAY',
        reason: 'Red Run test request'
      });

      // Activate Controlled Bug (Bug: approval omits balance update)
      setDeliberateRedRunBug(true);

      const { updatedBalance } = approveLeaveRequest(req.id, manager);

      if (process.env.TEST_MODE === 'RED_RUN') {
        // In Red Run test execution, we assert correct behavior so the test FAILS as required!
        expect(updatedBalance.available).toBe(initialAvailable - 3);
      } else {
        // Normal test mode: verify bug behaves as expected when toggle is active
        expect(updatedBalance.available).toBe(initialAvailable); // Didn't deduct!
      }
    });
  });
});
