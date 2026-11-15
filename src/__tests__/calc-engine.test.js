import { describe, it, expect } from 'vitest';
import { evaluate, applyOperator } from '../calc-engine.js';

describe('calc-engine', () => {
  it('adds, subtracts, multiplies, divides', () => {
    expect(applyOperator(2, '+', 3)).toBe(5);
    expect(applyOperator(2, '-', 3)).toBe(-1);
    expect(applyOperator(2, '*', 3)).toBe(6);
    expect(applyOperator(6, '/', 3)).toBe(2);
  });

  it('evaluates left-to-right with no operator precedence', () => {
    expect(evaluate(['2', '+', '3', '*', '4'])).toEqual({ value: '20' });
  });

  it('returns an error on divide-by-zero', () => {
    expect(evaluate(['1', '/', '0'])).toEqual({ error: true });
    expect(applyOperator(1, '/', 0)).toEqual({ error: true });
  });

  it('handles decimal input', () => {
    expect(evaluate(['1.5', '+', '2.25'])).toEqual({ value: '3.75' });
  });

  it('rounds results exceeding 12 significant digits', () => {
    expect(evaluate(['1', '/', '3'])).toEqual({ value: '0.333333333333' });
  });

  it('treats malformed token sequences as errors', () => {
    expect(evaluate([])).toEqual({ error: true });
    expect(evaluate(['2', '+'])).toEqual({ error: true });
    expect(evaluate(['2', '?', '3'])).toEqual({ error: true });
  });
});
