// playwright.config.js
// C-3 BrowserSpec config (plan section 1 "Binding planning outline", step 3).
// Per plan: Playwright webServer runs the production build preview (vite preview
// against the prebuilt dist/ output from T-3's `npm run build`), bound to
// localhost only (127.0.0.1), never an open/public interface (AR-008, T-2, I-45).
import { defineConfig } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: BASE_URL,
  },
  webServer: {
    // T-2: build then preview the production build; T-3 build-exit-code gate
    // runs first (per FH-1 / DI-3), BrowserSpec only consumes dist/, it does
    // not perform its own build (C-3 description).
    command: `npx vite preview --port ${PORT} --strictPort --host 127.0.0.1`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  // Single browser engine per plan (I-45/C-3); exact engine choice is an
  // ordinary engineering default (chromium), not a human-approval item.
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
