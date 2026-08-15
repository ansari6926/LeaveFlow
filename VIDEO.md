# LeaveFlow — Assessment Video Walkthrough & Live Demo

## 🎥 Video Link
**Google Drive Presentation & Live Demo**:  
[https://drive.google.com/file/d/1f9CXdMcB8MTCMA9i8aB-qfWzFJDxRXuS/view?usp=sharing](https://drive.google.com/file/d/1f9CXdMcB8MTCMA9i8aB-qfWzFJDxRXuS/view?usp=sharing)

---

## ⏱️ Video Structure Breakdown (~5 Minutes)

### Part 1: Problem, Approach & Architecture (~2 minutes)
- **Problem Statement**: Challenges in traditional spreadsheet leave tracking, unverified balances, conflicting overlaps, and lack of rejection auditability.
- **Solution & Architecture**: 3D Glassmorphic visual centerpiece, decoupled React 18 + Node/Express REST backend with persistent SQLite database engine.
- **Business Rules & Testing Strategy**: 14 server-side business rules, dual Vitest + Playwright automated test suites, deliberate Red Run bug detection, and AI Change Loop for Half-Day Leave.

### Part 2: Live Application Demo (~3 minutes)
- **3D SaaS Landing Page**: Showcase Three.js WebGL translucent approval card, smooth scrolling, feature grid, and business rules matrix.
- **Employee Workflow**: Log in as `employee@leaveflow.com`, inspect available balances (Annual, Casual, Sick), submit full-day and half-day leave requests, and view status in activity log.
- **Manager Workflow**: Log in as `manager@leaveflow.com`, inspect pending queue, approve request (verify real-time balance deduction), reject request with mandatory feedback note, and review team balance directory.
- **Automated Test Suite Verification**: Demonstrating Vitest unit tests (15/15 passed) and Playwright E2E browser automation (5/5 passed).
