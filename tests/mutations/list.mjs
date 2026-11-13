// Defect-injection list for mutation lane.
// Each entry documents a representative defect from UPDATED_PROJECT_PLAN.md section 10
// (mutation table, DI-1..DI-5) and the invariants/behaviors it must break.

const defects = [
  {
    id: "DI-1",
    breaks: ["B-1", "I-1"],
    mutation:
      "Change the rendered greeting string in src/App.jsx from 'Hello, World!' to 'Hello World' (remove comma and exclamation mark).",
    target: "src/App.jsx",
    spec: "src/App.test.jsx",
    expected_failing_tests: ["T-1"],
    file: "src/App.jsx",
    find: "  return <div>Hello, World!</div>;",
    replace: "  return <div>Hello World</div>;",
  },
  {
    id: "DI-2",
    breaks: ["B-1", "I-41", "I-43"],
    mutation:
      "Remove the createRoot(...).render(...) mount call in src/main.jsx so nothing is mounted to the DOM root.",
    target: "src/main.jsx",
    spec: "tests/browser/hello.spec.js",
    expected_failing_tests: ["T-2"],
    file: "src/main.jsx",
    find: "createRoot(rootNode).render(<App />);",
    replace: "// mount removed",
  },
  {
    id: "DI-3",
    breaks: ["F-1", "I-5", "I-43"],
    mutation:
      "Introduce a syntax error in src/App.jsx (an unbalanced JSX tag) so the Vite build step fails before the browser spec can run.",
    target: "src/App.jsx",
    spec: "tests/browser/hello.spec.js",
    expected_failing_tests: ["T-3", "T-4"],
    file: "src/App.jsx",
    find: "  return <div>Hello, World!</div>;",
    replace: "  return <div>Hello, World!</div;",
  },
  {
    id: "DI-4",
    breaks: ["B-1", "I-41"],
    mutation:
      "Rename the root DOM mount element id in index.html so the selector main.jsx uses to find the mount node no longer matches.",
    target: "index.html",
    spec: "tests/browser/hello.spec.js",
    expected_failing_tests: ["T-2"],
    file: "index.html",
    find: '<div id="root"></div>',
    replace: '<div id="not-root"></div>',
  },
  {
    id: "DI-5",
    breaks: ["B-1", "I-1", "I-2"],
    mutation:
      "Alter the casing of the rendered greeting in src/App.jsx to 'hello, world!' so the exact case-sensitive text no longer matches.",
    target: "src/App.jsx",
    spec: "src/App.test.jsx",
    expected_failing_tests: ["T-1"],
    file: "src/App.jsx",
    find: "  return <div>Hello, World!</div>;",
    replace: "  return <div>hello, world!</div>;",
  },
  {
    id: "DI-6",
    breaks: ["B-3", "I-42"],
    mutation:
      "Make App.jsx mutate its own rendered text in response to a dispatched input/click event (e.g. append a character on click), violating the no-op-on-input invariant.",
    target: "src/App.jsx",
    spec: "src/App.test.jsx",
    expected_failing_tests: ["T-5"],
    file: "src/App.jsx",
    find: "export default function App() {\n  return <div>Hello, World!</div>;\n}",
    replace:
      "export default function App() {\n  return <div onClick={(e) => { e.currentTarget.textContent += \"!\"; }}>Hello, World!</div>;\n}",
  },
];

export { defects };
export default defects;
