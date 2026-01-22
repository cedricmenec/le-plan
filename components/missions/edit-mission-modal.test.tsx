import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi, beforeAll } from 'vitest'
import { EditMissionModal } from './edit-mission-modal'

beforeAll(() => {
  global.ResizeObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  
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

const mockMission = {
  id: '1',
  title: 'Mission Test',
  type: 'feature',
  estimation: 2,
  confidence: 80,
  project_parent: 'Projet A',
  status: 'todo'
}

test('renders edit mission modal with existing data', async () => {
  const onOpenChange = vi.fn()
  const onSubmit = vi.fn()
  
  render(
    <EditMissionModal 
      mission={mockMission} 
      open={true} 
      onOpenChange={onOpenChange} 
      onSubmit={onSubmit} 
    />
  )
  
  // Find title in modal
  expect(await screen.findByText(/modifier la mission/i)).toBeDefined()
  
  // Check if fields are populated
  const titleInput = screen.getByLabelText(/titre/i) as HTMLInputElement
  expect(titleInput.value).toBe(mockMission.title)
  
  const estimationInput = screen.getByLabelText(/estimation/i) as HTMLInputElement
  expect(estimationInput.value).toBe(mockMission.estimation.toString())
  
  // Submit form
  const submitBtn = screen.getByRole('button', { name: /enregistrer/i })
  fireEvent.click(submitBtn)
  
  expect(onSubmit).toHaveBeenCalled()
})
