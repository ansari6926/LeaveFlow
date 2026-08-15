# LeaveFlow — Intelligent Leave Approval & Management System

> **Tactive AI-Powered QA Automation, Documentation & Software Engineering Assessment Project**

LeaveFlow is a high-performance Leave Approval Management System built with a 3D glassmorphic SaaS landing page, full employee & manager workflow automation, server-side business rules validation, automated unit and end-to-end (E2E) test suites, deliberate Red Run evidence, and AI Change Loop integration.

---

## 🌟 Key Features & Architectural Highlights

1. **3D Glassmorphic Visual Centerpiece**:
   - WebGL Three.js interactive 3D hero object with physical translucency, metallic orbiting nodes, soft point lighting, and mouse-follow parallax motion.
2. **End-to-End Workflow Automation**:
   - **Employee Portal**: Real-time balance breakdown (Annual, Casual, Sick), request submission form, duration selection mode (Full Day, First Half, Second Half), and status history log.
   - **Manager Portal**: Pending approval queue, request inspection, quick approve/reject actions with mandatory rejection feedback notes, and team balance directory.
3. **14 Server-Enforced Business Rules**:
   - Date validity ($\text{Start} \le \text{End}$ & $\text{Duration} > 0$).
   - Balance cap checking (prevents requests exceeding remaining balance).
   - Overlap prevention algorithm (detects conflicting calendar dates).
   - Half-day leave integration (allows opposite half-days on same date; blocks identical half-days or full-day conflicts).
   - State immutability (completed requests cannot be altered).
   - Manager self-approval prevention.
   - Multi-tenant employee data privacy protection.
4. **Dual Automated Testing Suites**:
   - **Vitest**: Unit & integration tests for backend business rules, overlap logic, and authorization guards (15/15 passed).
   - **Playwright**: End-to-End browser UI automation covering landing page, login, submission, manager approval/rejection, and half-day math (5/5 passed).
5. **Assessment Compliance Evidence**:
   - **Deliberate Red Run**: Evidence of controlled bug detection stored in `test-results/red-run/`.
   - **Final Green Run**: Verified passing test evidence stored in `test-results/final-run/`.
   - **AI Change Loop**: Step-by-step feature implementation record in `docs/ai-change-loop.md`.
   - **Presentation Deck**: Interactive 10-slide HTML presentation deck in `presentation/index.html`.

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24.14.0 verified)
- **npm**: v9.0.0 or higher

### 1. Installation
Run `npm install` inside `backend`, `frontend`, and `tests` directories:

```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install

# Install Test Harness Dependencies
cd ../tests
npm install
npx playwright install
```

### 2. Running the Application Locally
You can run the backend and frontend concurrently:

```bash
# Terminal 1: Start Backend API (Port 5000)
cd backend
npm start

# Terminal 2: Start Frontend Application (Port 3000)
cd frontend
npm run dev
```

Open your browser at **http://localhost:3000** to explore the application!

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Pre-filled Helper Button |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee@leaveflow.com` | `Password123!` | Click **Fill Employee Demo** |
| **Manager** | `manager@leaveflow.com` | `Password123!` | Click **Fill Manager Demo** |

---

## 🧪 Running Automated Test Suites

### 1. Run Vitest Business Logic Unit Tests
```bash
cd tests
npm run test:unit
```

### 2. Run Playwright E2E Browser Automation Tests
```bash
cd tests
npx playwright test
```

### 3. Generate Red Run & Green Run Assessment Evidence
```bash
node tests/run-assessment-tests.js
```
This generates the evidence files in `test-results/red-run/` and `test-results/final-run/`.

---

## 🔴 Deliberate Red Run Explanation

As required by Section 16 of the Tactive assessment:
1. Controlled bug `DELIBERATE_RED_RUN_BUG` was introduced into `leaveService.js` (bypassing balance deduction upon approval).
2. Running the test suite detected the bug and failed as expected (`expected 9 available, received 12`).
3. Captured logs & JSON failure reports are stored in:
   - `test-results/red-run/red_run_output.log`
   - `test-results/red-run/red_run_report.json`
4. The bug was reverted/corrected, and the final passing test execution evidence was recorded under:
   - `test-results/final-run/final_run_output.log`
   - `test-results/final-run/final_run_report.json`

---

## 🔄 AI Change Loop Explanation

As required by Section 17 of the Tactive assessment:
- Feature implemented: **Half-Day Leave Support** (`Full Day`, `First Half`, `Second Half`).
- AI analyzed existing application, updated duration math (0.5 days), updated overlap check algorithm for same-date half-day combinations, and ran tests across 2 iteration cycles until 100% passed.
- Full details, prompts, code diffs, and test results are documented in:
  - `docs/ai-change-loop.md`

---

## 📁 Repository Structure

```
LeaveFlow/
├── frontend/             # React + Vite + Three.js WebGL Landing Page & Dashboards
│   ├── src/
│   │   ├── components/   # Hero3D, Navbar, Footer, Modals, Status Badges
│   │   ├── pages/        # LandingPage, EmployeeDashboard, ManagerDashboard
│   │   ├── context/      # AuthContext
│   │   ├── styles/       # Modern Glassmorphic CSS Design System
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
│
├── backend/              # Node.js + Express REST API Server
│   ├── src/
│   │   ├── services/     # Leave Business Rules & Validation Engine
│   │   ├── db.js         # Persistent File-backed Database Store
│   │   └── server.js     # REST API Controller Routes
│   └── package.json
│
├── tests/                # Automated QA Test Suites
│   ├── unit/             # Vitest business rules test suite
│   ├── e2e/              # Playwright E2E browser automation spec
│   ├── run-assessment-tests.js  # Evidence generation harness
│   └── playwright.config.js
│
├── docs/                 # Technical Assessment Documentation
│   ├── architecture.md   # System architecture & component data flow
│   ├── design.md         # Entity schemas, state machine & rule matrix
│   ├── user-guide.md     # Non-technical step-by-step evaluator guide
│   └── ai-change-loop.md # Documented AI change loop for Half-Day Leave
│
├── test-results/         # Automated QA Execution Evidence
│   ├── red-run/          # Deliberate bug output logs & JSON failure report
│   └── final-run/        # Final all-green test output logs & report
│
├── presentation/         # Standalone Interactive 10-Slide Presentation Deck
│   └── index.html
│
├── README.md             # Evaluator Quickstart & Setup Guide
└── .gitignore
```

---

## 📄 License & Assessment Verification
Engineered for the **Tactive AI-Powered QA Automation, Documentation & Software Engineering Assessment**. All features, tests, documents, and deliverables fully compliant with the specification.
