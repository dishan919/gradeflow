import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { ...devices['Desktop Chrome'], channel: 'chrome', headless: true },
  projects: [
    { name: 'development-mobile', use: { baseURL: 'http://127.0.0.1:5175', viewport: { width: 390, height: 844 } } },
    { name: 'production-mobile', use: { baseURL: 'http://127.0.0.1:4175/gradeflow/', viewport: { width: 390, height: 844 } } },
    { name: 'production-desktop', use: { baseURL: 'http://127.0.0.1:4175/gradeflow/', viewport: { width: 1280, height: 900 } } },
  ],
  webServer: [
    { command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5175 --strictPort', url: 'http://127.0.0.1:5175', reuseExistingServer: false },
    { command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4175 --strictPort', url: 'http://127.0.0.1:4175/gradeflow/', reuseExistingServer: false },
  ],
});
