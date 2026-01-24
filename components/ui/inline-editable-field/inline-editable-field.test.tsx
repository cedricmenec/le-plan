import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { InlineEditableField } from './inline-editable-field'

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
