import { render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi, beforeAll } from 'vitest'
import { ProjectMissionList } from './project-mission-list'
import { MissionState } from '@/lib/types'
import { MemoryRouter } from 'react-router-dom'

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

test('renders project mission list', async () => {
  const initialMissions = [
    { id: '1', title: 'Mission 1', type: 'feature', state: MissionState.Active, project_id: 'project-1', projects: { name: 'Project 1' }, subtasks: [] }
  ] as any

  render(<MemoryRouter><ProjectMissionList projectId="project-1" initialMissions={initialMissions} /></MemoryRouter>)

  expect(screen.getByText(/Mission 1/i)).toBeDefined()
})

test('refreshes page when a mission is created', async () => {
  const initialMissions = [] as any
  render(<MemoryRouter><ProjectMissionList projectId="project-1" initialMissions={initialMissions} /></MemoryRouter>)

  // Simulate mission:created event
  window.dispatchEvent(new CustomEvent('missions:created'))

  await waitFor(() => {
    expect(window.location.reload).toHaveBeenCalled()
  })
})
