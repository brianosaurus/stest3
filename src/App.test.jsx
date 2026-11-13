import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders a case-insensitive "hello, world" greeting', () => {
    render(<App />);
    const match = screen.getAllByText((content) =>
      content.toLowerCase().includes('hello, world')
    );
    expect(match.length).toBeGreaterThan(0);
  });
});
