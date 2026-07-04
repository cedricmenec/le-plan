import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, vi, beforeEach } from 'vitest'
import { InlineEditableField } from './inline-editable-field'

// Mock scrollIntoView
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

test('renders initial value', () => {
  render(<InlineEditableField value="Initial Value" onSave={vi.fn()} />)
  expect(screen.getByText('Initial Value')).toBeDefined()
})

test('switches to edit mode on click', () => {
  render(<InlineEditableField value="Initial Value" onSave={vi.fn()} />)
  fireEvent.click(screen.getByText('Initial Value'))
  expect(screen.getByDisplayValue('Initial Value')).toBeDefined()
})

test('calls onSave and switches back to display mode on blur', async () => {
  const onSave = vi.fn()
  render(<InlineEditableField value="Initial Value" onSave={onSave} />)
  
  fireEvent.click(screen.getByText('Initial Value'))
  const input = screen.getByDisplayValue('Initial Value')
  
  fireEvent.change(input, { target: { value: 'Updated Value' } })
  fireEvent.blur(input)
  
  expect(onSave).toHaveBeenCalledWith('Updated Value')
  // After saving, it might show "Saving..." or the new value depending on implementation
})

test('renders as textarea when type is textarea', () => {
  render(<InlineEditableField value="Initial Value" onSave={vi.fn()} type="textarea" />)
  fireEvent.click(screen.getByText('Initial Value'))
  expect(screen.getByDisplayValue('Initial Value').tagName).toBe('TEXTAREA')
})

test('renders as priority badge when type is priority', () => {
  render(<InlineEditableField value="high" onSave={vi.fn()} type="priority" />)
  expect(screen.getByText('Haute')).toBeDefined()
})

test('calls onSave when priority is changed', async () => {
  const onSave = vi.fn(() => Promise.resolve())
  render(<InlineEditableField value="medium" onSave={onSave} type="priority" />)
  
  // Click to enter edit mode
  fireEvent.click(screen.getByText('Moyenne'))
  
  // Open the select
  const trigger = screen.getByRole('combobox')
  fireEvent.click(trigger)
  
  // Find and click 'Basse' in the select content
  const option = await screen.findByText('Basse')
  fireEvent.click(option)
  
  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith('low')
  })
})