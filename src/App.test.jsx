import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the exact literal greeting text "Hello, World!"', () => {
    render(<App />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });
});
