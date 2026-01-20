import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { SubtaskList } from './subtask-list'

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
  render(<SubtaskList missionId="1" />)
  
  const subtask1 = await screen.findByText(/Subtask 1/i)
  const subtask2 = await screen.findByText(/Subtask 2/i)
  
  expect(subtask1).toBeDefined()
  expect(subtask2).toBeDefined()
})