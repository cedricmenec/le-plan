import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProjectMissionList } from './project-mission-list'
import { expect, test, vi, beforeEach } from 'vitest'
import { Database } from '@/types/database.types'

type Mission = Database['public']['Tables']['missions']['Row']

// Mock scrollIntoView which is missing in jsdom
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Mission In Progress',
    status: 'in_progress',
    estimation: 5,
    user_id: 'u1',
    created_at: '',
    type: 'feature',
    confidence: 100,
    project_parent: null,
    project_id: 'p1'
  },
  {
    id: '2',
    title: 'Mission Todo',
    status: 'todo',
    estimation: 3,
    user_id: 'u1',
    created_at: '',
    type: 'feature',
    confidence: 100,
    project_parent: null,
    project_id: 'p1'
  }
]

// Mock supabase client
vi.mock('@/lib/supabase/client', () => {
  const mockMissions = [
    {
      id: '1',
      title: 'Mission In Progress',
      status: 'in_progress',
      estimation: 5,
      user_id: 'u1',
      created_at: '',
      type: 'feature',
      confidence: 100,
      project_parent: null,
      project_id: 'p1'
    },
    {
      id: '2',
      title: 'Mission Todo',
      status: 'todo',
      estimation: 3,
      user_id: 'u1',
      created_at: '',
      type: 'feature',
      confidence: 100,
      project_parent: null,
      project_id: 'p1'
    }
  ]
  const result = Promise.resolve({ data: mockMissions, error: null })
  const chain: any = {
    order: vi.fn(() => ({
      ...chain,
      then: (onfulfilled: any) => result.then(onfulfilled),
      catch: (onrejected: any) => result.catch(onrejected),
    }))
  }
  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => chain)
        }))
      }))
    }))
  }
})

test('shows all non-completed missions by default', async () => {
  render(<ProjectMissionList projectId="p1" initialMissions={mockMissions} />)
  
  // Both missions should be shown by default now
  expect(screen.getByText('Mission In Progress')).toBeDefined()
  expect(screen.getByText('Mission Todo')).toBeDefined()
})

test('renders dashboard with stats', () => {
  render(<ProjectMissionList projectId="p1" initialMissions={mockMissions} />)
  
  // Remaining workload should be 8
  expect(screen.getByText('8 jours')).toBeDefined()
})
