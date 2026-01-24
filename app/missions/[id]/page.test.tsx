import { render, screen } from '@testing-library/react'
import MissionDetailPage from './page'
import { expect, test, vi } from 'vitest'

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
    subtasks: []
  }))
}))

vi.mock('../../projects/actions', () => ({
  getProjects: vi.fn(() => Promise.resolve([
    { id: 'p1', name: 'Test Project' }
  ]))
}))

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
  expect(screen.getByText('5')).toBeDefined()
  expect(screen.getByText('80')).toBeDefined()
  expect(screen.getByTestId('task-list')).toBeDefined()
})
