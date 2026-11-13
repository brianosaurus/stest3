// Browser (Playwright) tests for the React "Hello, World!" app.
// Derived from UPDATED_PROJECT_PLAN.md section 10 (Automated-test strategy),
// behaviors B-1/B-2 and invariants I-1/I-2.
import { test, expect } from '@playwright/test';

// B-1/D-1/I-1: exact rendered text via ui_contract data-testid "greeting".
test('B-1/D-1/I-1: greeting element shows exact text "Hello, World!"', async ({ page }) => {
  await page.goto('/');
  const greeting = page.locator('[data-testid="greeting"]');
  await expect(greeting).toHaveText('Hello, World!');
});

// I-2/F-1: no console 'error'-level events or uncaught page errors during load.
// console.warn (e.g. React StrictMode dev warnings) is explicitly permitted.
test('I-2/F-1: app mounts without console errors or uncaught page errors', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err);
  });

  await page.goto('/');
  // Ensure the app has had a chance to mount/render before asserting.
  await expect(page.locator('[data-testid="greeting"]')).toHaveText('Hello, World!');

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

// B-2: no other interactive behavior exists; app remains static after load.
// Re-check the greeting text is unchanged after a short wait, confirming no
// async mutation of the DOM occurs.
test('B-2: app remains static after load with no other interactive behavior', async ({ page }) => {
  await page.goto('/');
  const greeting = page.locator('[data-testid="greeting"]');
  await expect(greeting).toHaveText('Hello, World!');

  await page.waitForTimeout(250);

  await expect(greeting).toHaveText('Hello, World!');
  // Only one greeting element should exist; no duplicate/extra render.
  await expect(page.locator('[data-testid="greeting"]')).toHaveCount(1);
});
