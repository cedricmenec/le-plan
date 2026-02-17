import { render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi, beforeAll } from 'vitest'
import { ProjectMissionList } from './project-mission-list'
import { MissionState } from '@prisma/client'

beforeAll(() => {
  global.ResizeObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  
  // Mock window.location.reload
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { reload: vi.fn() },
  })
})

// Mock useRouter
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: mockRefresh,
  })),
}))

// Mock Supabase - though ProjectMissionList should avoid direct calls now
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        }))
      }))
    }))
  }))
}))

test('renders project mission list', async () => {
  const initialMissions = [
    { id: '1', title: 'Mission 1', type: 'feature', state: MissionState.Active, project_id: 'project-1', projects: { name: 'Project 1' }, subtasks: [] }
  ] as any

  render(<ProjectMissionList projectId="project-1" initialMissions={initialMissions} />)

  expect(screen.getByText(/Mission 1/i)).toBeDefined()
})

test('refreshes page when a mission is created', async () => {
  const initialMissions = [] as any
  render(<ProjectMissionList projectId="project-1" initialMissions={initialMissions} />)

  // Simulate mission:created event
  window.dispatchEvent(new CustomEvent('missions:created'))

  await waitFor(() => {
    expect(mockRefresh).toHaveBeenCalled()
  })
})
