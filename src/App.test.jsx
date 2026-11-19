import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

afterEach(() => {
  cleanup();
});

describe('App (calculator UI)', () => {
  it('renders the themed root with expected selector contract (AC-8 smoke)', () => {
    render(<App />);
    const root = document.querySelector('.calculator-app');
    expect(root).not.toBeNull();
    expect(document.querySelector('.calculator-display')).not.toBeNull();
    expect(document.querySelectorAll('.calculator-button').length).toBeGreaterThan(0);
  });

  it('clicking digit buttons updates the display (AC-1 wiring sanity)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByTestId('calculator-display').textContent).toBe('12');
  });

  it('keyboard digit and operator entry matches click-driven behavior (AC-5)', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.keyboard('5+3');
    const keyboardDisplay = screen.getByTestId('calculator-display').textContent;
    unmount();
    cleanup();

    render(<App />);
    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    const clickDisplay = screen.getByTestId('calculator-display').textContent;

    expect(keyboardDisplay).toBe(clickDisplay);
  });

  it('pressing Enter computes the result same as clicking = (AC-5)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('6+4');
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('calculator-display').textContent).toBe('10');
  });

  it('pressing Backspace deletes the last character like the delete behavior (AC-6)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('12');
    await user.keyboard('{Backspace}');
    expect(screen.getByTestId('calculator-display').textContent).toBe('1');
  });

  it('pressing Escape fully clears the calculator like the C button (AC-6)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('123');
    await user.keyboard('{Escape}');
    expect(screen.getByTestId('calculator-display').textContent).toBe('0');
  });
});
