import { render, screen } from '@testing-library/react'
import { ProjectDashboard } from './project-dashboard'
import { expect, test } from 'vitest'
import { Database } from '@/types/database.types'

type Mission = Database['public']['Tables']['missions']['Row']

const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Mission 1',
    status: 'todo',
    estimation: 5,
    user_id: 'u1',
    created_at: '2024-01-01',
    type: 'feature',
    confidence: 3,
    project_parent: null,
    project_id: 'p1',
    goal: 'Goal 1',
    notes: 'Notes 1',
    estimated_delivery_date: null,
    desired_delivery_date: null,
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Mission 2',
    status: 'in_progress',
    estimation: 3,
    user_id: 'u1',
    created_at: '2024-01-01',
    type: 'study',
    confidence: 2,
    project_parent: null,
    project_id: 'p1',
    goal: 'Goal 2',
    notes: 'Notes 2',
    estimated_delivery_date: null,
    desired_delivery_date: null,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Mission 3',
    status: 'done',
    estimation: 1,
    user_id: 'u1',
    created_at: '2024-01-01',
    type: 'support',
    confidence: 3,
    project_parent: null,
    project_id: 'p1',
    goal: 'Goal 3',
    notes: 'Notes 3',
    estimated_delivery_date: null,
    desired_delivery_date: null,
    priority: 'medium'
  }
]

test('calculates and renders statistics correctly', () => {
  render(<ProjectDashboard missions={mockMissions} />)
  
  // Tasks by status (both Todo and In Progress have 1)
  expect(screen.getAllByText('1').length).toBe(2)
  
  // Remaining workload: 5 + 3 = 8
  expect(screen.getByText('8 jours')).toBeDefined()
})

test('renders zero states correctly', () => {
  render(<ProjectDashboard missions={[]} />)
  
  expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(2)
  expect(screen.getByText('0 jours')).toBeDefined()
})
