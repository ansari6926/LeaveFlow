# LeaveFlow — System Architecture & Engineering Specifications

## 1. System Overview
LeaveFlow is a high-performance Leave Approval Management System engineered for enterprise transparency, strict business rule enforcement, zero-configuration local deployment, and visual excellence.

```mermaid
graph TD
    Client["React 18 + Three.js WebGL Frontend (Port 3000)"]
    API["Express REST API Server (Port 5000)"]
    Service["Leave Business Rules & Validation Engine"]
    DB[("Persistent SQLite JSON DB Store")]
    TestHarness["Vitest & Playwright QA Suite"]

    Client -->|HTTP REST / JWT| API
    API --> Service
    Service --> DB
    TestHarness -->|Unit & Integration| Service
    TestHarness -->|E2E Visual & Browser Flow| Client
```

---

## 2. Component Architecture

### Frontend Layer (`frontend/`)
- **React 18 + Vite**: Lightning-fast HMR and modular component rendering.
- **Three.js WebGL Centerpiece (`Hero3D.jsx`)**: Glassmorphism translucent 3D approval card with physical lighting, soft shadows, metallic orbits, and mouse-follow parallax animation.
- **State & Auth Context (`AuthContext.jsx`)**: Token storage in `localStorage`, role-based route protection, session revalidation.
- **Components**:
  - `Navbar.jsx`: Brand logo, navigation links, role badges, quick login triggers.
  - `LandingPage.jsx`: Hero, feature metrics grid, workflow timeline, business rules matrix.
  - `EmployeeDashboard.jsx`: Real-time leave balances (Annual, Casual, Sick), request history table, status badges.
  - `ManagerDashboard.jsx`: Pending approval queue, team balance directory, rejection modal trigger, approval log.
  - `LeaveRequestModal.jsx`: Leave category picker, date range picker, duration mode (Full Day, First Half, Second Half), reason input, real-time day calculation preview.
  - `RejectionModal.jsx`: Enforces mandatory rejection reason string input.

### Backend REST API Layer (`backend/`)
- **Express.js Server (`server.js`)**: Clean modular REST endpoints:
  - `POST /api/auth/login`: User authentication with JWT signing.
  - `GET /api/auth/me`: Current session revalidation.
  - `GET /api/leave/balances`: Logged-in user balances.
  - `GET /api/leave/requests`: Requests array (filtered by employee ID for employees; all requests for managers).
  - `POST /api/leave/requests`: Leave submission with full validation engine check.
  - `PUT /api/leave/requests/:id/approve`: Manager approval route.
  - `PUT /api/leave/requests/:id/reject`: Manager rejection route with mandatory reason.
  - `POST /api/test/red-run-toggle` & `POST /api/test/reset-db`: Test harness control endpoints.

### Business Rules & Validation Engine (`backend/src/services/leaveService.js`)
- Enforces all 14 business rules server-side.
- Manages half-day duration math (0.5 days vs 1.0 day).
- Manages date range overlap checks with half-day granularity.
- Supports `DELIBERATE_RED_RUN_BUG` toggle for assessment QA verification.

---

## 3. Data & Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor Employee
    participant Frontend
    participant API as Express API
    participant Engine as Business Logic Engine
    actor Manager

    Employee->>Frontend: Select dates & Submit Request (0.5 or 1.0 day)
    Frontend->>API: POST /api/leave/requests (JWT Token)
    API->>Engine: submitLeaveRequest()
    Engine-->>Engine: 1. Validate dates & duration > 0<br/>2. Check available balance<br/>3. Check overlapping requests
    Engine-->>API: Request created (PENDING)
    API-->>Frontend: 201 Created

    Manager->>Frontend: Open Manager Dashboard
    Frontend->>API: GET /api/leave/requests
    API-->>Frontend: Pending Requests List

    Manager->>Frontend: Click Approve
    Frontend->>API: PUT /api/leave/requests/:id/approve
    API->>Engine: approveLeaveRequest()
    Engine-->>Engine: Deduct requested days from balance & set APPROVED
    Engine-->>API: Return updated request & balance
    API-->>Frontend: 200 OK (Real-Time Balance Update)
```

---

## 4. Technology Selection Rationale
1. **Node.js + Express**: Lightweight, zero external platform dependencies, simple single-command startup.
2. **Persistent File DB**: Guarantees instant zero-compilation startup on any operating system without C++ toolchain dependencies.
3. **Three.js**: Lightweight 3D canvas rendering without heavy asset loading or UI performance overhead.
4. **Vitest + Playwright**: Modern, fast test runners supporting unit, API integration, and E2E browser automation.
