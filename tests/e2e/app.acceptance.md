# Browser acceptance handoff — Hello World app

Covers requirements: R1, D-1, F-1. Invariants: I-1, I-2. Behaviors: B-1, B-2.

## Invocation

1. Build and start the dev server (Group B of the plan's verification):
   ```sh
   npm run build
   npx vite --host 127.0.0.1 --port 5173 --strictPort &
   ```
2. Run the suite against the running server:
   ```sh
   npx playwright test tests/e2e/app.spec.js --reporter=line
   ```
   Runtime URL argument: baseURL `http://127.0.0.1:5173` (set in `playwright.config.js`); the
   spec navigates to `/`.

## Assertions (automated, in `tests/e2e/app.spec.js`)

- `[data-testid="greeting"]` is present and its text equals exactly `Hello, World!`
  (covers B-1/D-1/I-1; case and punctuation exact, no leading/trailing whitespace).
- No `console` event of type `error` fires during page load; `console.warn` (e.g. React
  StrictMode dev warnings) is explicitly permitted and does not fail the check (covers I-2).
- No `pageerror` (uncaught exception) event fires during page load (covers I-2).

## Defect-injection expectations (covers F-1, I-1, I-2)

- DJ-1 (`src/App.jsx` mutated to render `Hello World`): the exact-text assertion above must
  fail; build exit code is unaffected (mutation is valid JSX).
- DJ-2 (`src/main.jsx` mutated to throw during mount): the `pageerror`/console-error listener
  assertion above must fail; build exit code is unaffected per F-1 (runtime-only failure).

Run via `tests/defects/run-injections.sh`, which launches both injections concurrently on
ports 5174 (DJ-1) and 5175 (DJ-2), distinct from the main dev server's port 5173.

## Observations still requiring a person

- Visual/cosmetic rendering across browsers (fonts, layout) — no stated style requirements,
  not acceptance-blocking per plan section 11.
- Confirm Playwright browser binaries are installed/launchable in the target execution
  environment before relying on a green run; this handoff does not install browsers.

## Selector/behavior contract used

- `[data-testid="greeting"]` div in `src/App.jsx`, exact text `Hello, World!`.
- `#root` mount point in `index.html`, mounted by `src/main.jsx`.
