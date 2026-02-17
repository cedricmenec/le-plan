import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { TaskList } from './task-list'

// Mock server actions
const mockUpdateTask = vi.fn((id: string, updates: any) => Promise.resolve({}))
const mockCreateTask = vi.fn((task: any) => Promise.resolve({ id: '3', ...task }))
const mockDeleteTask = vi.fn((missionId: string, id: string) => Promise.resolve({}))

vi.mock('@/app/missions/actions', () => ({
  updateTask: (id: string, updates: any) => mockUpdateTask(id, updates),
  createTask: (task: any) => mockCreateTask(task),
  deleteTask: (missionId: string, id: string) => mockDeleteTask(missionId, id),
  reorderTasks: vi.fn(() => Promise.resolve())
}))

// Mock Supabase
const mockUpdate = vi.fn(() => ({
  eq: vi.fn(() => Promise.resolve({ error: null }))
}))
const mockFrom = vi.fn(() => ({
  select: vi.fn(() => ({
    eq: vi.fn(() => ({
      order: vi.fn(() => Promise.resolve({ 
        data: [
          { id: '1', title: 'Task 1', is_completed: false, estimation: 0.5, position: 0 },
          { id: '2', title: 'Task 2', is_completed: true, estimation: 1, position: 1 },
        ], 
        error: null 
      })),
    })),
  })),
  update: mockUpdate,
  delete: vi.fn(() => ({
    eq: vi.fn(() => Promise.resolve({ error: null }))
  })),
  insert: vi.fn(() => ({
    select: vi.fn(() => ({
      single: vi.fn(() => Promise.resolve({ data: { id: '3', title: 'New Task', is_completed: false, estimation: 0.5, position: 2 }, error: null }))
    }))
  }))
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom
  })),
}))

// Mock pointer capture for Radix UI
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.hasPointerCapture = vi.fn()
  window.HTMLElement.prototype.setPointerCapture = vi.fn()
  window.HTMLElement.prototype.releasePointerCapture = vi.fn()
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
}

test('renders task list with completion and estimation', async () => {
  render(<TaskList missionId="1" />)
  
  const task1 = await screen.findByText(/Task 1/i)
  expect(task1).toBeDefined()

  // Task 2 is hidden by default because it's completed
  expect(screen.queryByText(/Task 2/i)).toBeNull()

  // Show completed tasks
  const toggleButton = await screen.findByText(/Voir les tâches terminées/i)
  fireEvent.click(toggleButton)

  const task2 = await screen.findByText(/Task 2/i)
  expect(task2).toBeDefined()

  // Check for checkboxes
  const checkboxes = screen.getAllByRole('checkbox')
  expect(checkboxes.length).toBe(2)
  expect((checkboxes[0] as HTMLInputElement).getAttribute('aria-checked')).toBe('false')
  expect((checkboxes[1] as HTMLInputElement).getAttribute('aria-checked')).toBe('true')

  // Check for estimation values
  expect(screen.getByText('0.5')).toBeDefined()
  expect(screen.getByText('1')).toBeDefined()
})

test('clicking checkbox calls updateTask', async () => {
  render(<TaskList missionId="1" />)
  
  const checkboxes = await screen.findAllByRole('checkbox')
  fireEvent.click(checkboxes[0])
  
  await waitFor(() => {
    expect(mockUpdateTask).toHaveBeenCalledWith('1', { is_completed: true })
  })
})

test('changing estimation calls updateTask via popover on double click', async () => {
  render(<TaskList missionId="1" />)
  
  // Wait for tasks to load
  const estimationText = await screen.findByText('0.5')
  
  // Double click to open popover
  fireEvent.doubleClick(estimationText)
  
  // Now the input should be visible
  const estimationInput = screen.getByDisplayValue('0.5')
  
  fireEvent.change(estimationInput, { target: { value: '2.5' } })
  // Trigger blur to save
  fireEvent.blur(estimationInput)
  
  await waitFor(() => {
    expect(mockUpdateTask).toHaveBeenCalledWith('1', { estimation: 2.5 })
  })
})

test('double-clicking a task title enters edit mode', async () => {
  render(<TaskList missionId="1" />)
  
  const task1Label = await screen.findByText(/Task 1/i)
  
  // Double click
  fireEvent.doubleClick(task1Label)
  
  // Should show an input
  const input = screen.getByDisplayValue('Task 1')
  expect(input).toBeDefined()
  
  // Change value
  fireEvent.change(input, { target: { value: 'Updated Task 1' } })
  fireEvent.keyDown(input, { key: 'Enter' })
  
  await waitFor(() => {
    expect(mockUpdateTask).toHaveBeenCalledWith('1', { title: 'Updated Task 1' })
  })
})

test('displays clarified task counter', async () => {
  render(<TaskList missionId="1" />)
  
  // Wait for tasks to load
  await screen.findByText(/Task 1/i)
  
  const counter = screen.getByText(/1 restantes \/ 2 au total/i)
  expect(counter).toBeDefined()
})
