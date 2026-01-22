import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi, beforeAll } from 'vitest'
import { DeleteMissionDialog } from './delete-mission-dialog'

beforeAll(() => {
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

test('renders delete confirmation dialog and handles confirm', async () => {
  const onConfirm = vi.fn()
  const onOpenChange = vi.fn()
  
  const { rerender } = render(
    <DeleteMissionDialog 
      open={true} 
      onOpenChange={onOpenChange} 
      onConfirm={onConfirm} 
    />
  )
  
  // Find title and description
  expect(await screen.findByText(/supprimer cette mission/i)).toBeDefined()
  expect(screen.getByText(/cette action est irréversible/i)).toBeDefined()
  
  // Find cancel button
  const cancelBtn = screen.getByRole('button', { name: /annuler/i })
  expect(cancelBtn).toBeDefined()
  
  // Find delete button
  const deleteBtn = screen.getByRole('button', { name: /supprimer/i })
  expect(deleteBtn).toBeDefined()
  
  // Click delete
  fireEvent.click(deleteBtn)
  expect(onConfirm).toHaveBeenCalled()
})
