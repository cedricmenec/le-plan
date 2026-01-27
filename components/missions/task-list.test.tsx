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
          { id: '1', title: 'Task 1', status: 'todo', estimation: 0.5, position: 0 },
          { id: '2', title: 'Task 2', status: 'done', estimation: 1, position: 1 },
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
      single: vi.fn(() => Promise.resolve({ data: { id: '3', title: 'New Task', status: 'todo', estimation: 0.5, position: 2 }, error: null }))
    }))
  }))
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom
  })),
}))

test('renders task list with status and estimation', async () => {
  render(<TaskList missionId="1" />)
  
  const task1 = await screen.findByText(/Task 1/i)
  const task2 = await screen.findByText(/Task 2/i)
  
  expect(task1).toBeDefined()
  expect(task2).toBeDefined()

  // Check for status text (in SelectTrigger)
  expect(screen.getByText(/À faire/i)).toBeDefined()
  expect(screen.getByText(/Terminé/i)).toBeDefined()

  // Check for estimation values
  expect(screen.getByDisplayValue('0.5')).toBeDefined()
  expect(screen.getByDisplayValue('1')).toBeDefined()
})

test('changing estimation calls updateTask', async () => {
  render(<TaskList missionId="1" />)
  
  const estimationInput = await screen.findByDisplayValue('0.5')
  
  fireEvent.change(estimationInput, { target: { value: '2.5' } })
  
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