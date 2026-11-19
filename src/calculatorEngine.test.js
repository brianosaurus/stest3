import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  applyDigit,
  applyDecimal,
  applyOperator,
  applyEquals,
  applyClear,
  applyBackspace,
  getDisplay,
} from './calculatorEngine';

describe('AC-1 digit entry', () => {
  it('appends digits in order pressed', () => {
    let s = createInitialState();
    s = applyDigit(s, '1');
    s = applyDigit(s, '2');
    s = applyDigit(s, '3');
    expect(getDisplay(s)).toBe('123');
  });
});

describe('AC-2 decimal guard (I-1)', () => {
  it('appends a single decimal point', () => {
    let s = createInitialState();
    s = applyDigit(s, '1');
    s = applyDecimal(s);
    expect(getDisplay(s)).toBe('1.');
  });

  it('second decimal press is a no-op', () => {
    let s = createInitialState();
    s = applyDigit(s, '1');
    s = applyDecimal(s);
    s = applyDigit(s, '5');
    s = applyDecimal(s);
    expect(getDisplay(s)).toBe('1.5');
  });
});

describe('AC-3 all four operators', () => {
  it('computes addition', () => {
    let s = createInitialState();
    s = applyDigit(s, '2');
    s = applyOperator(s, '+');
    s = applyDigit(s, '3');
    s = applyEquals(s);
    expect(getDisplay(s)).toBe('5');
  });

  it('computes subtraction', () => {
    let s = createInitialState();
    s = applyDigit(s, '5');
    s = applyOperator(s, '-');
    s = applyDigit(s, '3');
    s = applyEquals(s);
    expect(getDisplay(s)).toBe('2');
  });

  it('computes multiplication', () => {
    let s = createInitialState();
    s = applyDigit(s, '4');
    s = applyOperator(s, '*');
    s = applyDigit(s, '3');
    s = applyEquals(s);
    expect(getDisplay(s)).toBe('12');
  });

  it('computes division', () => {
    let s = createInitialState();
    s = applyDigit(s, '9');
    s = applyOperator(s, '/');
    s = applyDigit(s, '3');
    s = applyEquals(s);
    expect(getDisplay(s)).toBe('3');
  });
});

describe('AC-4 clear', () => {
  it('resets to initial state', () => {
    let s = createInitialState();
    s = applyDigit(s, '5');
    s = applyOperator(s, '+');
    s = applyDigit(s, '3');
    s = applyClear(s);
    expect(getDisplay(s)).toBe('0');
    expect(s.operator).toBe(null);
  });
});

describe('AC-7 divide by zero + recovery', () => {
  it('sets error state without crashing', () => {
    let s = createInitialState();
    s = applyDigit(s, '5');
    s = applyOperator(s, '/');
    s = applyDigit(s, '0');
    s = applyEquals(s);
    expect(s.error).toBe(true);
    expect(getDisplay(s)).toBe('Error');
  });

  it('next digit press starts a fresh calculation', () => {
    let s = createInitialState();
    s = applyDigit(s, '5');
    s = applyOperator(s, '/');
    s = applyDigit(s, '0');
    s = applyEquals(s);
    s = applyDigit(s, '7');
    expect(s.error).toBe(false);
    expect(getDisplay(s)).toBe('7');
  });

  it('operator press after error also recovers (applyClear then applies operator)', () => {
    let s = createInitialState();
    s = applyDigit(s, '5');
    s = applyOperator(s, '/');
    s = applyDigit(s, '0');
    s = applyEquals(s);
    s = applyOperator(s, '+');
    expect(s.error).toBe(false);
    expect(s.operand1).toBe('0');
    expect(s.operator).toBe('+');
  });
});

describe('Backspace behavior', () => {
  it('backspace on operand1 before an operator is chosen', () => {
    let s = createInitialState();
    s = applyDigit(s, '1');
    s = applyDigit(s, '2');
    s = applyDigit(s, '3');
    s = applyBackspace(s);
    expect(getDisplay(s)).toBe('12');
    expect(s.active).toBe('operand1');
  });

  it('backspace reduces single-digit operand1 to 0', () => {
    let s = createInitialState();
    s = applyDigit(s, '5');
    s = applyBackspace(s);
    expect(getDisplay(s)).toBe('0');
  });

  it('backspace on operand2 after an operator is chosen leaves operand1 and operator untouched', () => {
    let s = createInitialState();
    s = applyDigit(s, '7');
    s = applyOperator(s, '+');
    s = applyDigit(s, '1');
    s = applyDigit(s, '2');
    s = applyBackspace(s);
    expect(getDisplay(s)).toBe('1');
    expect(s.operand1).toBe('7');
    expect(s.operator).toBe('+');
  });
});

describe('Trailing decimal commit (I-1 / §7 trailing-dot rule)', () => {
  it('applyOperator on a trailing-decimal operand resolves to non-decimal numeric value', () => {
    let s = createInitialState();
    s = applyDigit(s, '1');
    s = applyDecimal(s);
    // display is "1." at this point
    expect(getDisplay(s)).toBe('1.');
    s = applyOperator(s, '+');
    expect(s.operand1).toBe('1');
  });

  it('applyEquals on a trailing-decimal operand resolves to non-decimal numeric value', () => {
    let s = createInitialState();
    s = applyDigit(s, '2');
    s = applyOperator(s, '+');
    s = applyDigit(s, '1');
    s = applyDecimal(s);
    // operand2 display is "1."
    s = applyEquals(s);
    expect(getDisplay(s)).toBe('3');
  });
});

describe('operator override and operator-after-result', () => {
  it('replaces pending operator when operand2 not yet entered', () => {
    let s = createInitialState();
    s = applyDigit(s, '5');
    s = applyOperator(s, '+');
    s = applyOperator(s, '-');
    expect(s.operator).toBe('-');
    expect(s.operand1).toBe('5');
  });

  it('computes then applies new operator when operand2 already entered', () => {
    let s = createInitialState();
    s = applyDigit(s, '5');
    s = applyOperator(s, '+');
    s = applyDigit(s, '3');
    s = applyOperator(s, '*');
    expect(s.operand1).toBe('8');
    expect(s.operator).toBe('*');
  });
});

describe('equals edge cases (§7)', () => {
  it('equals with no operator is a no-op', () => {
    let s = createInitialState();
    s = applyDigit(s, '5');
    s = applyEquals(s);
    expect(getDisplay(s)).toBe('5');
  });

  it('equals with operator but no operand2 treats operand2 as equal to operand1', () => {
    let s = createInitialState();
    s = applyDigit(s, '5');
    s = applyOperator(s, '+');
    s = applyEquals(s);
    expect(getDisplay(s)).toBe('10');
  });
});
