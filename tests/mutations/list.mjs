// Defect-injection list for mutation lane.
// Each entry documents a representative wrong implementation and which
// behavior/invariant it must break, per UPDATED_PROJECT_PLAN.md section 10
// (DJ-1, DJ-2) and section 7 (I-1, I-2).

const defects = [
  {
    id: "DJ-1",
    breaks: ["I-1", "B-1"],
    mutation:
      "App.jsx renders the text 'Hello World' (missing comma and exclamation mark) instead of the exact literal 'Hello, World!' required by I-1.",
    target: "src/App.jsx",
    spec: "tests/e2e/app.spec.js",
    expected_failing_tests: ["I-1", "B-1"],
    file: "src/App.jsx",
    find: '  return <div data-testid="greeting">Hello, World!</div>;',
    replace: '  return <div data-testid="greeting">Hello World</div>;',
  },
  {
    id: "DJ-2",
    breaks: ["I-2"],
    mutation:
      "main.jsx throws an exception during the mount of App, causing an uncaught page error instead of mounting synchronously without error as required by I-2.",
    target: "src/main.jsx",
    spec: "tests/e2e/app.spec.js",
    expected_failing_tests: ["I-2"],
    file: "src/main.jsx",
    find: "ReactDOM.createRoot(document.getElementById('root')).render(",
    replace:
      "throw new Error('mount failure');\nReactDOM.createRoot(document.getElementById('root')).render(",
  },
];

export { defects };
export default defects;
