import { render, screen } from '@testing-library/react'
import ProjectDetailPage from './page'
import { expect, test, vi } from 'vitest'

// Mock the server components/actions
vi.mock('../actions', () => ({
  getProject: vi.fn(() => Promise.resolve({
    id: 'p1',
    name: 'Test Project',
    missions: [
      { id: 'm1', title: 'Mission 1', status: 'in_progress', type: 'feature', estimation: 5 }
    ]
  }))
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve({
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } })
    }
  })
}))

// Mock ProjectMissionList to verify it's used
vi.mock('@/components/projects/project-mission-list', () => ({
  ProjectMissionList: () => <div data-testid="project-mission-list">Mocked Mission List</div>
}))

test('renders project detail page with missions', async () => {

  const params = Promise.resolve({ id: 'p1' })

  const Page = await ProjectDetailPage({ params })

  render(Page)

  

  expect(screen.getAllByText('Test Project')).toHaveLength(2)

  expect(screen.getByTestId('project-mission-list')).toBeDefined()

})
