import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { MissionList } from './mission-list'
import { MissionState } from '@/lib/types'

vi.mock('@/app/missions/actions', () => ({
  updateMission: vi.fn(),
  deleteMission: vi.fn(),
  getMission: vi.fn(),
  reorderQueue: vi.fn().mockResolvedValue([]),
}))

const mission = (overrides: Record<string, unknown>) => ({
  id: 'mission-id',
  title: 'Mission',
  type: 'feature',
  estimation: 1,
  confidence: 3,
  state: MissionState.Backlog,
  reason: null,
  priority: 'medium',
  goal: null,
  notes: null,
  estimated_delivery_date: null,
  desired_delivery_date: null,
  project_id: 'project-1',
  queue_position: null,
  project_parent: null,
  projects: { name: 'Atlas' },
  subtasks: [],
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
  ...overrides,
})

describe('MissionList lifecycle groups', () => {
  it('separates active, suspended, queued and backlog missions with visible planning labels', () => {
    render(
      <MemoryRouter>
        <MissionList
          layout="split"
          projectId="project-1"
          initialMissions={[
            mission({ id: 'active', title: 'Active mission', state: MissionState.Active }),
            mission({ id: 'suspended', title: 'Suspended mission', state: MissionState.Suspended, reason: 'Blocked' }),
            mission({ id: 'queued', title: 'Queued mission', state: MissionState.Queued, queue_position: 0 }),
            mission({ id: 'backlog', title: 'Backlog mission', state: MissionState.Backlog }),
          ] as any}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Missions actives')).toBeDefined()
    expect(screen.getByText('Missions suspendues')).toBeDefined()
    expect(screen.getByText("File d'attente")).toBeDefined()
    expect(screen.getByText('Backlog')).toBeDefined()
    expect(screen.getByText('Active mission')).toBeDefined()
    expect(screen.getByText('Suspended mission')).toBeDefined()
    expect(screen.getByRole('link', { name: 'Queued mission' })).toBeDefined()
    expect(screen.getByText('Backlog mission')).toBeDefined()
    expect(screen.getByLabelText('Rang 1')).toBeDefined()
  })

  it('keeps empty categories explicit without leaking missions from another state', () => {
    render(
      <MemoryRouter>
        <MissionList
          layout="split"
          projectId="project-1"
          initialMissions={[mission({ id: 'queued', title: 'Only queued', state: MissionState.Queued, queue_position: 0 })] as any}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('0 mission en cours')).toBeDefined()
    expect(screen.getByText('Aucune mission suspendue.')).toBeDefined()
    expect(screen.queryByText('Only queued', { selector: '[class*=line-clamp-2]' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Only queued' })).toBeDefined()
  })

  it('groups global queued missions by project or standalone scope without cross-project ordering', () => {
    render(
      <MemoryRouter>
        <MissionList
          layout="split"
          initialMissions={[
            mission({ id: 'atlas-1', title: 'Atlas first', state: MissionState.Queued, queue_position: 0, project_id: 'atlas', projects: { name: 'Atlas' } }),
            mission({ id: 'nova-1', title: 'Nova first', state: MissionState.Queued, queue_position: 0, project_id: 'nova', projects: { name: 'Nova' } }),
            mission({ id: 'solo-1', title: 'Solo first', state: MissionState.Queued, queue_position: 0, project_id: null, projects: null }),
          ] as any}
        />
      </MemoryRouter>
    )

    const queueSection = screen.getByText("File d'attente").closest('div')?.parentElement as HTMLElement
    expect(within(queueSection).getAllByText('Atlas').length).toBeGreaterThan(0)
    expect(within(queueSection).getAllByText('Nova').length).toBeGreaterThan(0)
    expect(within(queueSection).getAllByText('Missions autonomes').length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'Atlas first' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Nova first' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Solo first' })).toBeDefined()
  })
})
