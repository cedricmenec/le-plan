import { render, screen } from '@testing-library/react'
import MissionDetailPage from './page'
import { expect, test, vi } from 'vitest'
import { MissionState } from '@prisma/client'

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [] }),
        }),
      }),
    }),
  }),
}))

// Mock MissionStateActions
vi.mock('@/components/missions/mission-state-actions', () => ({
  MissionStateActions: ({ state }: any) => <div data-testid="state-actions">{state}</div>
}))

// Mock the server components/actions
vi.mock('../actions', () => ({
  getMission: vi.fn(() => Promise.resolve({
    id: 'm1',
    title: 'Test Mission',
    goal: 'Test Goal',
    notes: 'Test Notes',
    state: MissionState.Active,
    reason: null,
    type: 'feature',
    estimation: 5,
    confidence: 80,
    projects: { name: 'Test Project' },
    project_id: 'p1',
    subtasks: [],
    estimated_delivery_date: '2026-06-01',
    desired_delivery_date: '2026-06-15',
    rom_size: 'M',
    load_source: 'rom'
  })),
  getMilestones: vi.fn(() => Promise.resolve([])),
  updateMission: vi.fn(() => Promise.resolve())
}))

vi.mock('../../projects/actions', () => ({
  getProjects: vi.fn(() => Promise.resolve([
    { id: 'p1', name: 'Test Project' }
  ]))
}))

// Mock formatRelativeDuration to avoid complexity in this test
vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/utils')>()
  return {
    ...actual,
    formatRelativeDuration: vi.fn((date) => `relative-${date}`)
  }
})

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve({
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } })
    }
  })
}))

// Mock TaskList component
vi.mock('@/components/missions/task-list', () => ({
  TaskList: () => <div data-testid="task-list">Mocked Task List</div>
}))

test('renders mission detail page with project breadcrumbs', async () => {
  const params = Promise.resolve({ id: 'm1' })
  const Page = await MissionDetailPage({ params })
  render(Page)

  expect(screen.getByText('Projects')).toBeDefined()
  // One in breadcrumbs, one in header
  expect(screen.getAllByText('Test Project')).toHaveLength(2)
})

test('renders mission detail page', async () => {
  const params = Promise.resolve({ id: 'm1' })
  const Page = await MissionDetailPage({ params })
  render(Page)

  expect(screen.getAllByText('Test Mission')).toHaveLength(2)
  expect(screen.getByText('Test Goal')).toBeDefined()
  expect(screen.getByText('Test Notes')).toBeDefined()
  expect(screen.getByText('Feature')).toBeDefined()
  expect(screen.getByTestId('state-actions')).toBeDefined()
  expect(screen.getByText('Active')).toBeDefined()
  expect(screen.getByText(/remaining/i)).toBeDefined()
  expect(screen.getByText('80%')).toBeDefined()
  expect(screen.getByText('2026-06-01')).toBeDefined()
  expect(screen.getByText('2026-06-15')).toBeDefined()
  expect(screen.getByTestId('task-list')).toBeDefined()
})

test('renders mission detail page in readonly mode for Terminated state', async () => {
  const { getMission } = await import('../actions')
  // @ts-ignore
  getMission.mockResolvedValueOnce({
    id: 'm1',
    title: 'Completed Mission',
    goal: 'Completed Goal',
    notes: 'Completed Notes',
    state: MissionState.Terminated,
    reason: 'Done',
    type: 'feature',
    estimation: 5,
    confidence: 100,
    projects: { name: 'Test Project' },
    project_id: 'p1',
    subtasks: [],
    estimated_delivery_date: '2026-06-01',
    desired_delivery_date: '2026-06-15',
    rom_size: 'M',
    load_source: 'rom'
  })

  const params = Promise.resolve({ id: 'm1' })
  const Page = await MissionDetailPage({ params })
  render(Page)

  expect(screen.getAllByText('Completed Mission')).toHaveLength(2)
  
  // Should show Archive mode indicator
  expect(screen.getByText(/ARCHIVE/i)).toBeDefined()

  // State actions should NOT be shown (they are for transitions)
  expect(screen.queryByTestId('state-actions')).toBeNull()

  // Should show total duration instead of remaining
  // This will depend on MissionTimeline receiving readonly=true
  // We'll mock components to verify they receive readonly=true in real implementation
  // For now let's just check the button
  expect(screen.getByRole('button', { name: /RÉOUVRIR/i })).toBeDefined()
})
