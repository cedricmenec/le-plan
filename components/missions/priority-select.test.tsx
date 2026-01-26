import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi, beforeEach } from 'vitest'
import { PrioritySelect } from './priority-select'

// Mock scrollIntoView which is missing in jsdom
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

test('renders priority select with current value', () => {
  render(<PrioritySelect value="medium" onValueChange={() => {}} />)
  expect(screen.getByText('Moyenne')).toBeDefined()
})

test('calls onValueChange when a new value is selected', async () => {
  const onValueChange = vi.fn()
  render(<PrioritySelect value="medium" onValueChange={onValueChange} />)
  
  // Open the select
  const trigger = screen.getByRole('combobox')
  fireEvent.click(trigger)
  
  // Find and click the 'Haute' option
  // Note: Radix UI Select items might be in a Portal, so we use screen to find it
  const highOption = screen.getByText('Haute')
  fireEvent.click(highOption)
  
  expect(onValueChange).toHaveBeenCalledWith('high')
})
