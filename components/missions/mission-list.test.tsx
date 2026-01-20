import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { MissionList } from './mission-list'

// Mock Supabase
vi.mock('@/lib/supabase/client', () => {
  const missionsFirst = [
    { id: '1', title: 'Mission 1', type: 'feature', estimation: 2, status: 'todo' },
  ]
  const missionsAfter = [
    { id: '3', title: 'Nouvelle mission', type: 'feature', estimation: 1, status: 'todo' },
    ...missionsFirst,
  ]

  const orderMock = vi.fn()
    // initial fetches (first test, second test initial) return the same baseline
    .mockImplementationOnce(() => Promise.resolve({ data: missionsFirst, error: null }))
    .mockImplementationOnce(() => Promise.resolve({ data: missionsFirst, error: null }))
    // subsequent fetches (after a create) return the updated list
    .mockImplementation(() => Promise.resolve({ data: missionsAfter, error: null }))

  const mockFrom = vi.fn((table) => {
    if (table === 'missions') {
      return {
        select: vi.fn(() => ({
          order: orderMock,
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
  expect(mission1).toBeDefined()

  // the 'Nouvelle mission' is not present on the initial fetch
  expect(screen.queryByText(/Nouvelle mission/i)).toBeNull()
})

test('re-fetches missions when a mission is created (missions:created)', async () => {
  render(<MissionList />)

  // initial state: at least the baseline mission is present
  await screen.findByText(/Mission 1/i)

  // simulate another component notifying that a mission was created
  window.dispatchEvent(new CustomEvent('missions:created'))

  // MissionList should re-fetch and render the new mission
  const newMission = await screen.findByText(/Nouvelle mission/i)
  expect(newMission).toBeDefined()
})
