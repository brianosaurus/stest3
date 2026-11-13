// @ts-check
import { defineConfig } from '@playwright/test';

/**
 * Harness config for the React "Hello, World!" app (per UPDATED_PROJECT_PLAN.md s10).
 * The Vite dev server is started/stopped explicitly by the verification script
 * (green-check commands / tests/defects/run-injections.sh), not by Playwright's
 * webServer option, so this config intentionally does not declare one.
 */
export default defineConfig({
  testDir: 'tests',
  fullyParallel: false,
  retries: 0,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
  },
});
