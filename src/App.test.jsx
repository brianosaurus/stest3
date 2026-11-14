import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App.jsx'

describe('App', () => {
  it('renders a greeting containing Hello and World', () => {
    render(<App />)
    const content = screen.getByText(/\bhello\b.*\bworld\b/i)
    expect(content).toBeInTheDocument()
  })
})
