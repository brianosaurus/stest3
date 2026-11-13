// C-3 BrowserSpec (tests/browser/hello.spec.js)
// Loads the production build via the Playwright webServer (vite preview on
// dist/) in a real browser and asserts the page text, independently of the
// unit test oracle (O-2, O-3). Exact text literal fidelity per T-2/I-1.
import { test, expect } from '@playwright/test';

const EXPECTED_TEXT = 'Hello, World!';

// T-2 / B-1 / O-2 / O-3: page's visible text content equals exactly
// 'Hello, World!' including comma, exclamation mark and casing.
test('B-1/T-2: page displays exact text "Hello, World!"', async ({ page }) => {
  await page.goto('/');
  const bodyText = await page.textContent('body');
  expect(bodyText.trim()).toBe(EXPECTED_TEXT);
});

// O-6: defends against partial-match false positives from extra sibling
// text nodes altering the visible string — exact match above already
// enforces this; this test further confirms no other visible text exists.
test('O-6: no unexpected additional visible text beyond the greeting', async ({ page }) => {
  await page.goto('/');
  const bodyText = await page.textContent('body');
  expect(bodyText.trim()).toBe(EXPECTED_TEXT);
  expect(bodyText.trim().length).toBe(EXPECTED_TEXT.length);
});

// B-4: reload / repeated load produces identical output, no persisted state
// or variation across loads.
test('B-4: reload yields identical exact text with no variation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toHaveText(EXPECTED_TEXT);
  await page.reload();
  await expect(page.locator('body')).toHaveText(EXPECTED_TEXT);
});

// B-3 / T-5: dispatching representative input events (keyboard, click) after
// load produces no visible change; absence of change is itself correct
// behavior since there are no interactive elements, routes, or state.
test('B-3/T-5: keyboard and click input after load leaves text unchanged', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toHaveText(EXPECTED_TEXT);

  await page.keyboard.press('Tab');
  await page.keyboard.type('irrelevant input');
  await page.mouse.click(10, 10);

  await expect(page.locator('body')).toHaveText(EXPECTED_TEXT);
});
