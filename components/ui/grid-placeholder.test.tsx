import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GridPlaceholder } from './grid-placeholder'

describe('GridPlaceholder', () => {
  it('renders with default label', () => {
    render(<GridPlaceholder />)
    expect(screen.getByText('Grid placeholder')).toBeDefined()
  })

  it('renders with custom label', () => {
    render(<GridPlaceholder label="Custom slot" />)
    expect(screen.getByText('Custom slot')).toBeDefined()
  })

  it('has correct styling classes', () => {
    const { container } = render(<GridPlaceholder />)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('border-2')
    expect(div.className).toContain('border-dashed')
  })
})
