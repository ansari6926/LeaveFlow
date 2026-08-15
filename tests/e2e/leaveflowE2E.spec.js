import { test, expect } from '@playwright/test';

test.describe('LeaveFlow End-to-End Visual & Functional Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Reset database to clean state before each E2E scenario
    await page.request.post('http://localhost:5000/api/test/reset-db');
  });

  test('E2E-01: Landing Page renders headline, 3D Canvas, and features', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Leave Management, Simplified.');
    await expect(page.locator('#hero canvas')).toBeVisible();
    await expect(page.locator('#btn-hero-employee-start')).toBeVisible();
    await expect(page.locator('#btn-hero-manager-portal')).toBeVisible();
  });

  test('E2E-02: Employee can sign in, submit full-day leave request, and see pending status', async ({ page }) => {
    await page.goto('/');

    // Click Employee Sign In
    await page.click('#btn-nav-employee-login');
    await page.click('#btn-quick-fill-employee');
    await page.click('#btn-login-submit');

    // Verify Employee Dashboard
    await expect(page.locator('h1')).toContainText('Welcome back');
    await expect(page.locator('#balance-annual-available')).toContainText('12');

    // Click Request Leave
    await page.click('#btn-open-request-modal');
    await page.selectOption('#select-leave-type', 'ANNUAL');
    
    // Set dates for future
    await page.fill('#input-start-date', '2026-11-01');
    await page.fill('#input-end-date', '2026-11-02');
    await page.fill('#input-leave-reason', 'E2E Automated test annual vacation');
    
    await page.click('#btn-submit-request');

    // Verify request added to history table
    await expect(page.locator('table')).toContainText('E2E Automated test annual vacation');
    await expect(page.locator('table')).toContainText('PENDING');
  });

  test('E2E-03: Manager can sign in, view pending queue, approve request, and balance deducts', async ({ page }) => {
    // First, submit a request as employee via API
    const loginRes = await page.request.post('http://localhost:5000/api/auth/login', {
      data: { email: 'employee@leaveflow.com', password: 'Password123!' }
    });
    const { token } = await loginRes.json();

    const submitRes = await page.request.post('http://localhost:5000/api/leave/requests', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        leaveType: 'CASUAL',
        startDate: '2026-11-10',
        endDate: '2026-11-11',
        durationType: 'FULL_DAY',
        reason: 'E2E Manager approval target'
      }
    });
    const { request } = await submitRes.json();

    // Now log in as Manager
    await page.goto('/');
    await page.click('#btn-nav-manager-login');
    await page.click('#btn-quick-fill-manager');
    await page.click('#btn-login-submit');

    await expect(page.locator('h1')).toContainText('Manager Control Portal');
    await expect(page.locator(`#pending-card-${request.id}`)).toBeVisible();

    // Approve the request
    await page.click(`#btn-approve-request-${request.id}`);

    // Verify move to history table as APPROVED
    await expect(page.locator('table')).toContainText('APPROVED');
  });

  test('E2E-04: Manager can reject a leave request with mandatory rejection reason', async ({ page }) => {
    const loginRes = await page.request.post('http://localhost:5000/api/auth/login', {
      data: { email: 'employee@leaveflow.com', password: 'Password123!' }
    });
    const { token } = await loginRes.json();

    const submitRes = await page.request.post('http://localhost:5000/api/leave/requests', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        leaveType: 'SICK',
        startDate: '2026-11-20',
        endDate: '2026-11-20',
        durationType: 'FULL_DAY',
        reason: 'E2E Rejection test'
      }
    });
    const { request } = await submitRes.json();

    await page.goto('/');
    await page.click('#btn-nav-manager-login');
    await page.click('#btn-quick-fill-manager');
    await page.click('#btn-login-submit');

    await page.click(`#btn-reject-request-${request.id}`);

    // Fill rejection reason
    await page.fill('#input-rejection-reason', 'Insufficient team coverage on this date.');
    await page.click('#btn-confirm-rejection');

    await expect(page.locator('table')).toContainText('REJECTED');
    await expect(page.locator('table')).toContainText('Insufficient team coverage on this date.');
  });

  test('E2E-05: AI Change Loop Feature — Half-Day Leave submission calculates 0.5 days correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-nav-employee-login');
    await page.click('#btn-quick-fill-employee');
    await page.click('#btn-login-submit');

    await page.click('#btn-open-request-modal');
    await page.selectOption('#select-leave-type', 'CASUAL');
    await page.fill('#input-start-date', '2026-12-05');
    await page.fill('#input-end-date', '2026-12-05');
    await page.selectOption('#select-duration-type', 'FIRST_HALF');
    await page.fill('#input-leave-reason', 'Half day morning doctor appointment');

    await expect(page.locator('#calculated-days-preview')).toContainText('0.5 Day(s)');

    await page.click('#btn-submit-request');

    await expect(page.locator('table')).toContainText('First Half (0.5)');
    await expect(page.locator('table')).toContainText('Half day morning doctor appointment');
  });
});
