import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MissionList } from './mission-list'
import { Toaster } from '@/components/ui/toaster'
import { MissionState } from '@/lib/types'
import { updateMission } from '@/app/missions/actions'

vi.mock('@/app/missions/actions', () => ({
  updateMission: vi.fn(),
  deleteMission: vi.fn(),
  getMission: vi.fn(),
  reorderQueue: vi.fn().mockResolvedValue([]),
}))

// DndContext mocké : expose des boutons pour simuler différents drops
vi.mock('@dnd-kit/core', () => ({
  closestCenter: vi.fn(),
  DndContext: ({ children, onDragEnd }: any) => (
    <div>
      <button
        type="button"
        onClick={() => onDragEnd({ active: { id: 'queue:project-1:first' }, over: { id: 'active-zone' } })}
      >
        simulate drop on active zone
      </button>
      <button
        type="button"
        onClick={() => onDragEnd({ active: { id: 'backlog:backlog-1' }, over: { id: 'queue:project-1:queued' } })}
      >
        simulate drop backlog on own queue
      </button>
      <button
        type="button"
        onClick={() => onDragEnd({ active: { id: 'backlog:backlog-1' }, over: { id: 'queue:other-project:queued' } })}
      >
        simulate drop backlog on other queue
      </button>
      <button
        type="button"
        onClick={() => onDragEnd({ active: { id: 'backlog:backlog-1' }, over: { id: 'active-zone' } })}
      >
        simulate drop backlog on active zone
      </button>
      {children}
    </div>
  ),
  useDroppable: () => ({ isOver: false, setNodeRef: vi.fn() }),
  useDraggable: () => ({ attributes: {}, listeners: {}, setNodeRef: vi.fn(), isDragging: false }),
  useSensors: () => [],
  useSensor: () => ({}),
  PointerSensor: class {},
  KeyboardSensor: class {},
  pointerWithin: () => [],
  DragOverlay: ({ children }: any) => (children ? <div>{children}</div> : null),
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

describe('MissionList — drag Queued → Active', () => {
  beforeEach(() => {
    vi.mocked(updateMission).mockReset()
    vi.mocked(updateMission).mockResolvedValue(undefined)
  })

  it('calls updateMission with Active state when a queued mission is dropped on the active zone', async () => {
    render(
      <MemoryRouter>
        <MissionList layout="split" projectId="project-1" initialMissions={[mission({ id: 'first', title: 'First queued', state: MissionState.Queued, queue_position: 0 })] as any} />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'simulate drop on active zone' }))

    await waitFor(() => {
      expect(updateMission).toHaveBeenCalledWith('first', { state: MissionState.Active })
    })
  })

  it('restores the mission in the queue and shows a toast when persistence fails', async () => {
    vi.mocked(updateMission).mockRejectedValueOnce(new Error('nope'))
    render(
      <MemoryRouter>
        <MissionList layout="split" projectId="project-1" initialMissions={[mission({ id: 'first', title: 'First queued', state: MissionState.Queued, queue_position: 0 })] as any} />
        <Toaster />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'simulate drop on active zone' }))

    await waitFor(() => {
      expect(updateMission).toHaveBeenCalledWith('first', { state: MissionState.Active })
    })
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'First queued' })).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('Transition non enregistrée')).toBeDefined()
    })
  })
})

describe('MissionList — drag Backlog → Queue', () => {
  beforeEach(() => {
    vi.mocked(updateMission).mockReset()
    vi.mocked(updateMission).mockResolvedValue(undefined)
  })

  it('calls updateMission with Queued state when a backlog mission is dropped on its own scope queue', async () => {
    render(
      <MemoryRouter>
        <MissionList layout="split" projectId="project-1" initialMissions={[mission({ id: 'backlog-1', title: 'Backlog mission', state: MissionState.Backlog })] as any} />
        <Toaster />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'simulate drop backlog on own queue' }))

    await waitFor(() => {
      expect(updateMission).toHaveBeenCalledWith('backlog-1', { state: MissionState.Queued })
    })
  })

  it('ignores drops of a backlog mission on another scope queue and on the active zone', async () => {
    render(
      <MemoryRouter>
        <MissionList layout="split" projectId="project-1" initialMissions={[mission({ id: 'backlog-1', title: 'Backlog mission', state: MissionState.Backlog })] as any} />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'simulate drop backlog on other queue' }))
    fireEvent.click(screen.getByRole('button', { name: 'simulate drop backlog on active zone' }))

    // Laisse un micro-délai pour détecter tout appel indu
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(updateMission).not.toHaveBeenCalled()
  })

  it('restores the mission in the backlog and shows a toast when persistence fails', async () => {
    vi.mocked(updateMission).mockRejectedValueOnce(new Error('nope'))
    render(
      <MemoryRouter>
        <MissionList layout="split" projectId="project-1" initialMissions={[mission({ id: 'backlog-1', title: 'Backlog mission', state: MissionState.Backlog })] as any} />
        <Toaster />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'simulate drop backlog on own queue' }))

    await waitFor(() => {
      expect(updateMission).toHaveBeenCalledWith('backlog-1', { state: MissionState.Queued })
    })
    await waitFor(() => {
      expect(screen.getByText('Backlog mission')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('Transition non enregistrée')).toBeDefined()
    })
  })
})
