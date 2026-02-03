import { render, screen } from '@testing-library/react'
import MissionDetailPage from './page'
import { expect, test, vi } from 'vitest'

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

// Mock the server components/actions
vi.mock('../actions', () => ({
  getMission: vi.fn(() => Promise.resolve({
    id: 'm1',
    title: 'Test Mission',
    goal: 'Test Goal',
    notes: 'Test Notes',
    status: 'in_progress',
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
  expect(screen.getByText('En cours')).toBeDefined()
  expect(screen.getByText(/remaining/i)).toBeDefined()
  expect(screen.getByText('80%')).toBeDefined()
  expect(screen.getByText('2026-06-01')).toBeDefined()
  expect(screen.getByText('2026-06-15')).toBeDefined()
  expect(screen.getByTestId('task-list')).toBeDefined()
})
