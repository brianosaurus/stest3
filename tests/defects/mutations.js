// Defect-injection list for Group C (DJ-1, DJ-2), per UPDATED_PROJECT_PLAN.md
// section 10 (Automated-test strategy) and section 18 (Parallel verification
// groups). Each entry documents a representative wrong implementation and
// which invariant/behavior it must break.
//
// This is the canonical defect list referenced from the plan's protected
// verification paths (tests/defects/mutations.js) and consumed by
// tests/defects/run-injections.sh.

const defects = [
  {
    id: 'DJ-1',
    breaks: ['I-1', 'B-1'],
    mutation:
      "App.jsx renders the text 'Hello World' (missing comma and exclamation mark) instead of the exact literal 'Hello, World!' required by I-1.",
    file: 'src/App.jsx',
    find: '  return <div data-testid="greeting">Hello, World!</div>;',
    replace: '  return <div data-testid="greeting">Hello World</div>;',
    port: 5174,
    expected_failing_tests: ['I-1', 'B-1'],
  },
  {
    id: 'DJ-2',
    breaks: ['I-2'],
    mutation:
      "main.jsx throws an exception during the mount of App, causing an uncaught page error instead of mounting synchronously without error as required by I-2.",
    file: 'src/main.jsx',
    find: "ReactDOM.createRoot(document.getElementById('root')).render(",
    replace:
      "throw new Error('mount failure');\nReactDOM.createRoot(document.getElementById('root')).render(",
    port: 5175,
    expected_failing_tests: ['I-2'],
  },
];

export { defects };
export default defects;
