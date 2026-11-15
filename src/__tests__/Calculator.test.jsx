import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '../Calculator.jsx';

describe('Calculator UI', () => {
  it('renders display and digit/operator buttons', () => {
    render(<Calculator />);
    expect(screen.getByTestId('display')).toHaveTextContent('0');
    expect(screen.getByText('=')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('click updates display for chained operations', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    await user.click(screen.getByText('2'));
    await user.click(screen.getByText('+'));
    await user.click(screen.getByText('3'));
    await user.click(screen.getByText('*'));
    await user.click(screen.getByText('4'));
    await user.click(screen.getByText('='));
    expect(screen.getByTestId('display')).toHaveTextContent('20');
  });

  it('divide by zero shows Error and Clear recovers', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('/'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByText('='));
    expect(screen.getByTestId('display')).toHaveTextContent('Error');
    await user.click(screen.getByText('C'));
    expect(screen.getByTestId('display')).toHaveTextContent('0');
  });

  it('Escape keydown clears entry', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    await user.click(screen.getByText('7'));
    await user.keyboard('{Escape}');
    expect(screen.getByTestId('display')).toHaveTextContent('0');
  });

  it('Backspace keydown removes last character', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    await user.click(screen.getByText('7'));
    await user.click(screen.getByText('8'));
    await user.keyboard('{Backspace}');
    expect(screen.getByTestId('display')).toHaveTextContent('7');
  });
});
