import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { MissionList } from './mission-list'

// Mock Supabase
vi.mock('@/lib/supabase/client', () => {
  const mockFrom = vi.fn((table) => {
    if (table === 'missions') {
      return {
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: [
              { id: '1', title: 'Mission 1', type: 'feature', estimation: 2, status: 'todo' },
              { id: '2', title: 'Mission 2', type: 'support', estimation: 1, status: 'in_progress' },
            ], 
            error: null 
          })),
        })),
      }
    }
    if (table === 'subtasks') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
      }
    }
    return {}
  })

  return {
    createClient: vi.fn(() => ({
      from: mockFrom,
    })),
  }
})

test('renders mission list with missions', async () => {
  render(<MissionList />)
  
  const mission1 = await screen.findByText(/Mission 1/i)
  const mission2 = await screen.findByText(/Mission 2/i)
  
  expect(mission1).toBeDefined()
  expect(mission2).toBeDefined()
})
