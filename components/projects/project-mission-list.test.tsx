import { render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi, beforeAll } from 'vitest'
import { ProjectMissionList } from './project-mission-list'

beforeAll(() => {
  global.ResizeObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
})

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

// Mock Supabase
const mockSupabase = {
  from: vi.fn((table) => {
    const chain = {
      select: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      order: vi.fn(() => chain),
      then: (onfulfilled: any) => {
        const data = table === 'missions' ? [
          { id: '1', title: 'Mission 1', type: 'feature', status: 'in_progress', project_id: 'project-1', subtasks: [] }
        ] : [];
        return Promise.resolve({ data, error: null }).then(onfulfilled);
      }
    }
    return chain;
  })
}

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockSupabase)
}))

test('renders project mission list', async () => {
  const initialMissions = [
    { id: '1', title: 'Mission 1', type: 'feature', status: 'in_progress', project_id: 'project-1', projects: { name: 'Project 1' }, subtasks: [] }
  ] as any

  render(<ProjectMissionList projectId="project-1" initialMissions={initialMissions} />)

  expect(screen.getByText(/Mission 1/i)).toBeDefined()
})

test('refetches missions when a mission is created', async () => {
  const initialMissions = [] as any
  render(<ProjectMissionList projectId="project-1" initialMissions={initialMissions} />)

  // Simulate mission:created event
  window.dispatchEvent(new CustomEvent('missions:created'))

  await waitFor(() => {
    expect(mockSupabase.from).toHaveBeenCalledWith('missions')
  })
})