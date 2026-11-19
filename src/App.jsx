import { useEffect, useState } from 'react';
import {
  createInitialState,
  applyDigit,
  applyDecimal,
  applyOperator,
  applyEquals,
  applyClear,
  applyBackspace,
  getDisplay,
} from './calculatorEngine.js';

const OPERATOR_KEYS = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
};

const BUTTON_ROWS = [
  ['C', '/', '*', '-'],
  ['7', '8', '9', '+'],
  ['4', '5', '6', '='],
  ['1', '2', '3', '0'],
  ['.'],
];

function isOperator(label) {
  return Object.prototype.hasOwnProperty.call(OPERATOR_KEYS, label);
}

function App() {
  const [state, setState] = useState(createInitialState);

  useEffect(() => {
    function onKeyDown(event) {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        return;
      }

      const { key } = event;

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        setState((s) => applyDigit(s, key));
        return;
      }

      if (key === '.') {
        event.preventDefault();
        setState((s) => applyDecimal(s));
        return;
      }

      if (isOperator(key)) {
        event.preventDefault();
        setState((s) => applyOperator(s, key));
        return;
      }

      if (key === 'Enter' || key === '=') {
        event.preventDefault();
        setState((s) => applyEquals(s));
        return;
      }

      if (key === 'Backspace' || key === 'Delete') {
        event.preventDefault();
        setState((s) => applyBackspace(s));
        return;
      }

      if (key === 'Escape') {
        event.preventDefault();
        setState((s) => applyClear(s));
        return;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function handleButtonClick(label) {
    if (label === 'C') {
      setState((s) => applyClear(s));
    } else if (label === '=') {
      setState((s) => applyEquals(s));
    } else if (label === '.') {
      setState((s) => applyDecimal(s));
    } else if (isOperator(label)) {
      setState((s) => applyOperator(s, label));
    } else {
      setState((s) => applyDigit(s, label));
    }
  }

  return (
    <div className="calculator-app">
      <div className="calculator-display" data-testid="calculator-display">
        {getDisplay(state)}
      </div>
      <div className="calculator-grid">
        {BUTTON_ROWS.flat().map((label, index) => (
          <button
            key={`${label}-${index}`}
            type="button"
            className={
              'calculator-button' +
              (isOperator(label) ? ' calculator-button--operator' : '') +
              (label === 'C' ? ' calculator-button--clear' : '') +
              (label === '=' ? ' calculator-button--equals' : '') +
              (label === '.' ? ' calculator-button--decimal' : '')
            }
            onClick={() => handleButtonClick(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
