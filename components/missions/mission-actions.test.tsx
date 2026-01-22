import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, vi, beforeAll } from 'vitest'
import { MissionActions } from './mission-actions'

// Mock ResizeObserver which is often needed by Radix UI
beforeAll(() => {
  global.ResizeObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  
  // Mock PointerEvent
  if (!global.PointerEvent) {
    class PointerEvent extends MouseEvent {
      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params)
      }
    }
    // @ts-ignore
    global.PointerEvent = PointerEvent
  }
})

test('renders mission actions trigger and options', async () => {
  const onEdit = vi.fn()
  const onDelete = vi.fn()
  
  render(<MissionActions onEdit={onEdit} onDelete={onDelete} />)
  
  // Find the trigger button
  const trigger = screen.getByRole('button', { name: /actions/i })
  expect(trigger).toBeDefined()
  
  // Open the menu
  // Radix UI sometimes prefers pointerDown
  fireEvent.pointerDown(trigger, {
    pointerId: 1,
    button: 0,
    ctrlKey: false,
    pointerType: 'mouse',
  })
  fireEvent.click(trigger)
  
  // Find "Edit Mission" and "Delete Mission" options
  const editOption = await screen.findByText(/modifier/i)
  const deleteOption = await screen.findByText(/supprimer/i)
  
  expect(editOption).toBeDefined()
  expect(deleteOption).toBeDefined()
  
  // Click edit
  fireEvent.click(editOption)
  expect(onEdit).toHaveBeenCalled()
  
  // Re-open menu for delete click
  fireEvent.pointerDown(trigger, {
    pointerId: 1,
    button: 0,
    ctrlKey: false,
    pointerType: 'mouse',
  })
  fireEvent.click(trigger)
  
  const deleteOptionAgain = await screen.findByText(/supprimer/i)
  fireEvent.click(deleteOptionAgain)
  expect(onDelete).toHaveBeenCalled()
})
