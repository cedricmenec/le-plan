import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { TaskList } from './task-list'

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: [
              { id: '1', title: 'Subtask 1', is_completed: false },
              { id: '2', title: 'Subtask 2', is_completed: true },
            ], 
            error: null 
          })),
        })),
      })),
    })),
  })),
}))

test('renders subtask list', async () => {
  render(<TaskList missionId="1" />)
  
  const subtask1 = await screen.findByText(/Subtask 1/i)
  const subtask2 = await screen.findByText(/Subtask 2/i)
  
  expect(subtask1).toBeDefined()
  expect(subtask2).toBeDefined()
  
  // Check for delete buttons (Trash2 icon usually renders as an svg, we can check for buttons)
  const deleteButtons = screen.getAllByRole('button')
  // We expect at least 3 buttons: 2 deletes (one for each subtask) + 1 add button
  expect(deleteButtons.length).toBeGreaterThanOrEqual(3)
})