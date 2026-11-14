import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from './Calculator.jsx';

function getDisplay() {
  return screen.getByTestId('display').textContent;
}

describe('Calculator component', () => {
  it('AC-1: clicking digit, operator, equals updates display', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    expect(getDisplay()).toBe('5');
  });

  it('AC-2: digit keydown updates display like click', () => {
    render(<Calculator />);
    fireEvent.keyDown(window, { key: '7' });
    expect(getDisplay()).toBe('7');
  });

  it('AC-3: operator keydown computes like click', () => {
    render(<Calculator />);
    fireEvent.keyDown(window, { key: '4' });
    fireEvent.keyDown(window, { key: '*' });
    fireEvent.keyDown(window, { key: '5' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(getDisplay()).toBe('20');
  });

  it('AC-4: Enter computes like equals click', () => {
    render(<Calculator />);
    fireEvent.keyDown(window, { key: '9' });
    fireEvent.keyDown(window, { key: '-' });
    fireEvent.keyDown(window, { key: '4' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(getDisplay()).toBe('5');
  });

  it('AC-5: Escape and C clear display', () => {
    render(<Calculator />);
    fireEvent.keyDown(window, { key: '9' });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(getDisplay()).toBe('0');
    fireEvent.keyDown(window, { key: '9' });
    fireEvent.keyDown(window, { key: 'c' });
    expect(getDisplay()).toBe('0');
  });

  it('AC-6: Backspace removes last character', () => {
    render(<Calculator />);
    fireEvent.keyDown(window, { key: '1' });
    fireEvent.keyDown(window, { key: '2' });
    fireEvent.keyDown(window, { key: '3' });
    fireEvent.keyDown(window, { key: 'Backspace' });
    expect(getDisplay()).toBe('12');
  });
});
