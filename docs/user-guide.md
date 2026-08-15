# LeaveFlow — Non-Technical User & Evaluator Guide

Welcome to **LeaveFlow**. This guide explains how to access, navigate, and utilize LeaveFlow for employee leave applications and manager approval workflows.

---

## 1. Accessing the Application
Open your web browser and navigate to:
**http://localhost:3000**

You will land on the **3D Glossy Landing Page**.

---

## 2. Signing In
Click **Employee Sign In** or **Manager Sign In** in the top navigation bar.

### Preset Demo Accounts:
- **Employee Demo Account**:
  - Email: `employee@leaveflow.com`
  - Password: `Password123!`
  - Quick-Fill Button: Click **Fill Employee Demo** in the sign-in popup!
- **Manager Demo Account**:
  - Email: `manager@leaveflow.com`
  - Password: `Password123!`
  - Quick-Fill Button: Click **Fill Manager Demo** in the sign-in popup!

---

## 3. Employee Workflow: Submitting a Leave Request
1. Log in as an **Employee** (`employee@leaveflow.com`).
2. Your dashboard displays real-time available balances for:
   - **Annual Leave**
   - **Casual Leave**
   - **Sick Leave**
3. Click **+ Request Leave** in the top right.
4. Fill in the request form:
   - **Leave Type**: Select Annual, Casual, or Sick.
   - **Start Date & End Date**: Pick your leave dates.
   - **Duration Mode**: Choose **Full Day** (1.0 day/day), **First Half** (0.5 morning), or **Second Half** (0.5 afternoon).
   - **Reason**: Enter the reason for your leave request.
5. Click **Submit Request for Approval**.
6. Your request immediately appears in **My Leave Requests History** with status **PENDING**.

---

## 4. Manager Workflow: Approving & Rejecting Requests
1. Log in as a **Manager** (`manager@leaveflow.com`).
2. Navigate to **Manager Control Portal**.
3. Under **Pending Approval Queue**, review submitted requests:
   - Employee name, department, dates, duration mode, and reason are displayed.
4. **To Approve**:
   - Click the green **Approve** button.
   - The request status changes to **APPROVED**, and the employee's leave balance is automatically updated in real-time.
5. **To Reject**:
   - Click the red **Reject** button.
   - A popup modal will prompt for a mandatory **Reason for Rejection**.
   - Enter your reason (e.g. "Project milestone release week") and click **Confirm Rejection**.
   - The status updates to **REJECTED**, and the reason is recorded in the audit history.
