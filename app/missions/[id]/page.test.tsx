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
    subtasks: []
  }))
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve({
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } })
    }
  })
}))

// Mock SubtaskList component
vi.mock('@/components/missions/subtask-list', () => ({
  SubtaskList: () => <div data-testid="subtask-list">Mocked Subtask List</div>
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
  expect(screen.getByText('feature')).toBeDefined()
  expect(screen.getByText('in_progress')).toBeDefined()
  expect(screen.getByText('5 j')).toBeDefined()
  expect(screen.getByText('80%')).toBeDefined()
  expect(screen.getByTestId('subtask-list')).toBeDefined()
})
