import { describe, it, expect } from 'vitest';
import {
  initialState,
  inputDigit,
  inputDecimal,
  inputOperator,
  equals,
  clear,
  backspace,
} from './calcLogic.js';

describe('calcLogic', () => {
  it('AC-9: decimal point can only be entered once per number', () => {
    let s = initialState;
    s = inputDigit(s, '1');
    s = inputDecimal(s);
    s = inputDecimal(s);
    s = inputDigit(s, '5');
    expect(s.display).toBe('1.5');
  });

  it('AC-9: decimal resets after operator selection for next operand', () => {
    let s = initialState;
    s = inputDigit(s, '1');
    s = inputDecimal(s);
    s = inputDigit(s, '2');
    s = inputOperator(s, '+');
    s = inputDecimal(s);
    s = inputDigit(s, '3');
    expect(s.display).toBe('0.3');
  });

  it('AC-7: divide by zero returns error state without throwing', () => {
    let s = initialState;
    s = inputDigit(s, '5');
    s = inputOperator(s, '/');
    s = inputDigit(s, '0');
    expect(() => equals(s)).not.toThrow();
    s = equals(s);
    expect(s.display).toBe('Error');
    expect(s.error).toBe(true);
  });

  it('AC-7: while in error state, only clear recovers; other input is a no-op', () => {
    let s = initialState;
    s = inputDigit(s, '5');
    s = inputOperator(s, '/');
    s = inputDigit(s, '0');
    s = equals(s);
    const afterDigit = inputDigit(s, '3');
    expect(afterDigit).toEqual(s);
    const afterOp = inputOperator(s, '+');
    expect(afterOp).toEqual(s);
    const cleared = clear();
    expect(cleared).toEqual(initialState);
  });

  it('AC-5: clear resets to initial state', () => {
    let s = initialState;
    s = inputDigit(s, '7');
    s = inputOperator(s, '+');
    s = inputDigit(s, '2');
    s = clear();
    expect(s).toEqual(initialState);
  });

  it('AC-6: backspace removes the last entered character', () => {
    let s = initialState;
    s = inputDigit(s, '1');
    s = inputDigit(s, '2');
    s = inputDigit(s, '3');
    s = backspace(s);
    expect(s.display).toBe('12');
  });

  it('AC-6: backspace to single digit or empty resets display to "0"', () => {
    let s = initialState;
    s = inputDigit(s, '5');
    s = backspace(s);
    expect(s.display).toBe('0');
    expect(s.overwrite).toBe(true);
  });

  it('AC-6: backspace removing the decimal point re-enables decimal entry', () => {
    let s = initialState;
    s = inputDigit(s, '1');
    s = inputDecimal(s);
    s = backspace(s);
    expect(s.decimalUsed).toBe(false);
    s = inputDecimal(s);
    expect(s.display).toBe('1.');
  });

  it('AC-6: backspace is a no-op in result-shown state', () => {
    let s = initialState;
    s = inputDigit(s, '2');
    s = inputOperator(s, '+');
    s = inputDigit(s, '3');
    s = equals(s);
    const after = backspace(s);
    expect(after).toEqual(s);
  });

  it('consecutive operator presses replace the pending operator', () => {
    let s = initialState;
    s = inputDigit(s, '5');
    s = inputOperator(s, '+');
    s = inputOperator(s, '-');
    s = inputDigit(s, '2');
    s = equals(s);
    expect(s.display).toBe('3');
  });

  it('operator press on empty/zero display with no stored operand is a no-op', () => {
    const s = inputOperator(initialState, '+');
    expect(s).toEqual(initialState);
  });

  it('digit entry after a computed result starts a new number (overwrite)', () => {
    let s = initialState;
    s = inputDigit(s, '2');
    s = inputOperator(s, '+');
    s = inputDigit(s, '3');
    s = equals(s);
    s = inputDigit(s, '9');
    expect(s.display).toBe('9');
  });

  it('chained equals/operator computes basic arithmetic correctly', () => {
    let s = initialState;
    s = inputDigit(s, '4');
    s = inputOperator(s, '*');
    s = inputDigit(s, '5');
    s = equals(s);
    expect(s.display).toBe('20');
  });
});
