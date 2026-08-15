import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: [
    {
      command: 'npm run start',
      cwd: '../backend',
      url: 'http://localhost:5000/api/auth/me',
      reuseExistingServer: true,
      timeout: 120 * 1000
    },
    {
      command: 'npm run dev',
      cwd: '../frontend',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 120 * 1000
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
