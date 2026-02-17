import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, vi, beforeAll, describe, beforeEach } from 'vitest'
import { MissionList } from './mission-list'
import { MissionState } from '@prisma/client'

beforeAll(() => {
  global.ResizeObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  
  if (!global.PointerEvent) {
    class PointerEvent extends MouseEvent {
      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params)
      }
    }
    // @ts-ignore
    global.PointerEvent = PointerEvent
  }
})

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

// Mock server actions
vi.mock('@/app/missions/actions', () => ({
  updateMission: vi.fn(),
  deleteMission: vi.fn(),
  getMission: vi.fn(),
}))

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
  }))
}))

describe('MissionList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders mission list with missions', async () => {
    const mockMissions = [
      { id: '1', title: 'Mission 1', type: 'feature', estimation: 2, state: MissionState.Backlog, projects: { name: 'Projet Test' }, subtasks: [] },
    ]
    render(<MissionList initialMissions={mockMissions as any} />)

    const mission1 = await screen.findByText(/Mission 1/i)
    expect(mission1).toBeDefined()
  })

  test('renders mission goal and notes icon when present', async () => {
    const missions = [
      { 
        id: '1', 
        title: 'Mission with goal', 
        type: 'feature', 
        goal: 'This is the main goal', 
        notes: 'Some notes',
        estimation: 2, 
        state: MissionState.Backlog, 
        projects: null,
        confidence: 100,
        subtasks: []
      },
    ]
    render(<MissionList initialMissions={missions as any} />)

    expect(screen.getByText(/This is the main goal/i)).toBeDefined()
    expect(screen.getByTestId('notes-icon')).toBeDefined()
  })

  test('renders split layout correctly', () => {
    const missions = [
      { 
        id: '1', 
        title: 'Active Mission', 
        type: 'feature', 
        state: MissionState.Active, 
        estimation: 2, 
        created_at: '2026-01-24T10:00:00Z',
        projects: null,
        subtasks: []
      },
      { 
        id: '2', 
        title: 'Todo Mission', 
        type: 'study', 
        state: MissionState.Backlog, 
        estimation: 1, 
        created_at: '2026-01-24T11:00:00Z',
        projects: null,
        subtasks: []
      },
    ]
    render(<MissionList initialMissions={missions as any} layout="split" />)

    expect(screen.getByText('Missions actives')).toBeDefined()
    expect(screen.getByText('Missions non commencées')).toBeDefined()
    expect(screen.getByText('1 mission en cours')).toBeDefined()
    expect(screen.getByText('1 mission en attente')).toBeDefined()
    expect(screen.getByText('Active Mission')).toBeDefined()
    expect(screen.getByText('Todo Mission')).toBeDefined()
  })

  test('renders grid placeholders in active missions grid', () => {
    const missions = [
      { 
        id: '1', 
        title: 'Active Mission 1', 
        type: 'feature', 
        state: MissionState.Active, 
        estimation: 2, 
        created_at: '2026-01-24T10:00:00Z',
        projects: null,
        subtasks: []
      },
    ]
    render(<MissionList initialMissions={missions as any} layout="split" />)

    // Should have 1 mission + 2 placeholders to fill the row of 3
    const placeholders = screen.getAllByText('Encore de la place pour sauver le monde ?')
    expect(placeholders).toBeDefined()
  })
})
