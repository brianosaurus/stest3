import { useCallback, useEffect, useState } from 'react';
import { evaluate } from './calc-engine.js';

const OPERATORS = ['+', '-', '*', '/'];
const KEY_TO_OP = { '+': '+', '-': '-', '*': '*', '/': '/' };

const initialState = {
  tokens: [],
  current: '',
  error: false,
};

function displayValue(state) {
  if (state.error) return 'Error';
  if (state.current !== '') return state.current;
  if (state.tokens.length > 0) return state.tokens[state.tokens.length - 1];
  return '0';
}

function Calculator() {
  const [state, setState] = useState(initialState);

  const clear = useCallback(() => setState(initialState), []);

  const inputDigit = useCallback((digit) => {
    setState((prev) => {
      if (prev.error) return prev;
      return { ...prev, current: prev.current + digit };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState((prev) => {
      if (prev.error) return prev;
      if (prev.current.includes('.')) return prev;
      return { ...prev, current: prev.current === '' ? '0.' : prev.current + '.' };
    });
  }, []);

  const inputOperator = useCallback((op) => {
    setState((prev) => {
      if (prev.error) return prev;
      if (prev.current === '') return prev;
      return { tokens: [...prev.tokens, prev.current, op], current: '', error: false };
    });
  }, []);

  const inputEquals = useCallback(() => {
    setState((prev) => {
      if (prev.error) return prev;
      if (prev.current === '') return prev;
      const fullTokens = [...prev.tokens, prev.current];
      const result = evaluate(fullTokens);
      if (result.error) return { tokens: [], current: '', error: true };
      return { tokens: [], current: result.value, error: false };
    });
  }, []);

  const backspace = useCallback(() => {
    setState((prev) => {
      if (prev.error) return initialState;
      if (prev.current.length > 0) {
        return { ...prev, current: prev.current.slice(0, -1) };
      }
      if (prev.tokens.length > 0) {
        const tokens = prev.tokens.slice(0, -1);
        const current = prev.tokens[prev.tokens.length - 1];
        return { tokens, current: OPERATORS.includes(current) ? '' : current, error: false };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      const { key } = e;
      if (/^[0-9]$/.test(key)) {
        inputDigit(key);
        return;
      }
      if (key === '.') {
        inputDecimal();
        return;
      }
      if (KEY_TO_OP[key]) {
        inputOperator(KEY_TO_OP[key]);
        return;
      }
      if (key === 'Enter' || key === '=') {
        e.preventDefault();
        inputEquals();
        return;
      }
      if (key === 'Backspace') {
        backspace();
        return;
      }
      if (key === 'Escape' || key.toLowerCase() === 'c') {
        clear();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, inputOperator, inputEquals, backspace, clear]);

  return (
    <div className="calculator">
      <div className="display" data-testid="display">
        {displayValue(state)}
      </div>
      <div className="keys">
        <button type="button" className="clear" onClick={clear}>
          C
        </button>
        {['7', '8', '9'].map((d) => (
          <button key={d} type="button" onClick={() => inputDigit(d)}>
            {d}
          </button>
        ))}
        <button type="button" className="op" onClick={() => inputOperator('/')}>
          /
        </button>
        {['4', '5', '6'].map((d) => (
          <button key={d} type="button" onClick={() => inputDigit(d)}>
            {d}
          </button>
        ))}
        <button type="button" className="op" onClick={() => inputOperator('*')}>
          *
        </button>
        {['1', '2', '3'].map((d) => (
          <button key={d} type="button" onClick={() => inputDigit(d)}>
            {d}
          </button>
        ))}
        <button type="button" className="op" onClick={() => inputOperator('-')}>
          -
        </button>
        <button type="button" onClick={() => inputDigit('0')}>
          0
        </button>
        <button type="button" onClick={inputDecimal}>
          .
        </button>
        <button type="button" className="equals" onClick={inputEquals}>
          =
        </button>
        <button type="button" className="op" onClick={() => inputOperator('+')}>
          +
        </button>
      </div>
    </div>
  );
}

export default Calculator;
