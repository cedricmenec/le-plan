import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { TaskList } from './task-list'

// Mock server actions
const mockUpdateTask = vi.fn(() => Promise.resolve({}))
vi.mock('@/app/missions/actions', () => ({
  updateTask: (...args: any[]) => mockUpdateTask(...args)
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
          { id: '1', title: 'Task 1', is_completed: false, position: 0 },
          { id: '2', title: 'Task 2', is_completed: true, position: 1 },
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
      single: vi.fn(() => Promise.resolve({ data: { id: '3', title: 'New Task', is_completed: false, position: 2 }, error: null }))
    }))
  }))
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom
  })),
}))

test('renders task list', async () => {
  render(<TaskList missionId="1" />)
  
  const task1 = await screen.findByText(/Task 1/i)
  const task2 = await screen.findByText(/Task 2/i)
  
  expect(task1).toBeDefined()
  expect(task2).toBeDefined()
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