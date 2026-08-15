# AI Change Loop Documentation — Half-Day Leave Support

## 1. Feature Request Summary
**Feature Name**: Half-Day Leave Support  
**Original Assessment Prompt**:
> "Employees should be able to select Full Day, First Half, or Second Half when submitting a leave request. The system must correctly calculate leave consumption (0.5 days vs 1.0 day) and prevent conflicting half-day/full-day requests."

---

## 2. Step-by-Step AI Change Loop Trajectory

```mermaid
flowchart TD
    A["Feature Prompt Received: Half-Day Leave"] --> B["Inspect Backend & Frontend Schemas"]
    B --> C["Attempt 1: Add durationType to Schema & Submit Logic"]
    C --> D["Run Vitest & Overlap Logic Test Suite"]
    D --> E{"Failures Detected?"}
    E -- "Yes (Same-Day Overlap Error)" --> F["Analyze: First Half & Second Half conflict on same date"]
    F --> G["Attempt 2: Refine Overlap Engine for Granular Half-Day Conflicts"]
    G --> H["Run Vitest Suite Again"]
    H -- "Pass" --> I["All Tests Green (15/15 Passed)"]
    I --> J["Verify Playwright E2E UI Selector Integration"]
```

---

## 3. Iteration Log & Change Attempts

### Attempt 1: Schema Extension & Basic Duration Math
- **Files Modified**:
  - `backend/src/services/leaveService.js`
  - `frontend/src/components/LeaveRequestModal.jsx`
- **Changes**: Added `durationType` field (`FULL_DAY`, `FIRST_HALF`, `SECOND_HALF`) to leave submission payloads and updated `calculateDaysCount` to return `0.5` for half-day requests.
- **Tests Run**: `npx vitest run`
- **Failures Identified**:
  - `test-4.2`: A request for `FIRST_HALF` on `2026-10-15` blocked a subsequent request for `SECOND_HALF` on the exact same date `2026-10-15` with error: `Overlapping leave request detected`.
- **Root Cause Analysis**: The initial date overlap function `checkOverlap` only checked `newStart <= exEnd && newEnd >= exStart` based on calendar dates without inspecting the `durationType` parameter for half-day granularity.

### Attempt 2: Overlap Engine Refinement & Resolution
- **Files Modified**:
  - `backend/src/services/leaveService.js`
- **Correction Applied**: Updated `checkOverlap` function with granular half-day logic:
  - If both existing and new requests are half-days on the exact same date AND one is `FIRST_HALF` (morning) while the other is `SECOND_HALF` (afternoon), the overlap condition is bypassed (`continue`).
  - If either request is `FULL_DAY` or both requests target the same half (`FIRST_HALF` & `FIRST_HALF` or `SECOND_HALF` & `SECOND_HALF`), the overlap error is raised.
- **Tests Run**: `npx vitest run`
- **Result**: All 15 unit and integration tests passed cleanly!

---

## 4. Final Assessment Summary

| Metric | Details |
| :--- | :--- |
| **Original Prompt** | Half-Day Leave Support (Full Day, First Half, Second Half) |
| **Files Changed** | `backend/src/services/leaveService.js`, `frontend/src/components/LeaveRequestModal.jsx`, `tests/unit/leaveBusinessRules.test.js`, `tests/e2e/leaveflowE2E.spec.js` |
| **Number of Attempts** | 2 Iteration Cycles |
| **Failures Encountered** | 1 Overlap logic edge case on same-date opposite half-days |
| **Manual Intervention** | None (Fully automated AI execution) |
| **Final Test Result** | 100% Passed (Vitest: 15/15, Playwright E2E: 5/5) |
