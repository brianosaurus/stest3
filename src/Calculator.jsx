import { useEffect, useReducer } from 'react';
import {
  initialState,
  inputDigit,
  inputDecimal,
  inputOperator,
  equals,
  clear,
  backspace,
} from './calcLogic.js';
import './Calculator.css';

const DIGITS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
const OPERATORS = ['+', '-', '*', '/'];

function reducer(state, action) {
  switch (action.type) {
    case 'digit':
      return inputDigit(state, action.digit);
    case 'decimal':
      return inputDecimal(state);
    case 'operator':
      return inputOperator(state, action.operator);
    case 'equals':
      return equals(state);
    case 'clear':
      return clear();
    case 'backspace':
      return backspace(state);
    default:
      return state;
  }
}

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    function onKeyDown(event) {
      const { key } = event;
      if (key >= '0' && key <= '9') {
        dispatch({ type: 'digit', digit: key });
      } else if (key === '.') {
        dispatch({ type: 'decimal' });
      } else if (OPERATORS.includes(key)) {
        dispatch({ type: 'operator', operator: key });
      } else if (key === 'Enter' || key === '=') {
        dispatch({ type: 'equals' });
      } else if (key === 'Escape' || key === 'C' || key === 'c') {
        dispatch({ type: 'clear' });
      } else if (key === 'Backspace') {
        dispatch({ type: 'backspace' });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="calculator">
      <div className="display" data-testid="display">
        {state.display}
      </div>
      <div className="button-grid">
        <button type="button" className="btn clear" onClick={() => dispatch({ type: 'clear' })}>
          C
        </button>
        <button
          type="button"
          className="btn backspace"
          onClick={() => dispatch({ type: 'backspace' })}
        >
          ⌫
        </button>
        <button
          type="button"
          className="btn operator"
          onClick={() => dispatch({ type: 'operator', operator: '/' })}
        >
          /
        </button>
        <button
          type="button"
          className="btn operator"
          onClick={() => dispatch({ type: 'operator', operator: '*' })}
        >
          *
        </button>

        {DIGITS.slice(0, 3).map((d) => (
          <button key={d} type="button" className="btn digit" onClick={() => dispatch({ type: 'digit', digit: d })}>
            {d}
          </button>
        ))}
        <button
          type="button"
          className="btn operator"
          onClick={() => dispatch({ type: 'operator', operator: '-' })}
        >
          -
        </button>

        {DIGITS.slice(3, 6).map((d) => (
          <button key={d} type="button" className="btn digit" onClick={() => dispatch({ type: 'digit', digit: d })}>
            {d}
          </button>
        ))}
        <button
          type="button"
          className="btn operator"
          onClick={() => dispatch({ type: 'operator', operator: '+' })}
        >
          +
        </button>

        {DIGITS.slice(6, 9).map((d) => (
          <button key={d} type="button" className="btn digit" onClick={() => dispatch({ type: 'digit', digit: d })}>
            {d}
          </button>
        ))}
        <button type="button" className="btn equals" onClick={() => dispatch({ type: 'equals' })}>
          =
        </button>

        <button type="button" className="btn digit zero" onClick={() => dispatch({ type: 'digit', digit: '0' })}>
          0
        </button>
        <button type="button" className="btn decimal" onClick={() => dispatch({ type: 'decimal' })}>
          .
        </button>
      </div>
    </div>
  );
}
