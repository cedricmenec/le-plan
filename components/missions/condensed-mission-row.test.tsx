import { render, screen } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import { CondensedMissionRow } from './condensed-mission-row'
import { MissionWithProject } from './mission-card'

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('CondensedMissionRow', () => {
  const mockMission: MissionWithProject = {
    id: '1',
    title: 'Test Condensed Mission',
    type: 'feature',
    status: 'todo',
    estimation: 1.5,
    confidence: 85,
    goal: 'Test Goal',
    notes: 'Test Notes',
    project_parent: null,
    created_at: new Date().toISOString(),
    user_id: 'user-1',
    project_id: null,
    priority: 'medium',
    projects: {
      name: 'Awesome Project'
    },
    estimated_delivery_date: null,
    desired_delivery_date: null
  }

  test('renders with basic info', () => {
    render(
      <CondensedMissionRow 
        mission={mockMission} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    )

    expect(screen.getByText('Test Condensed Mission')).toBeDefined()
    expect(screen.getByText('feature')).toBeDefined()
    expect(screen.getByText('1.5 jours')).toBeDefined()
    // Should NOT show project name by default
    expect(screen.queryByText('Awesome Project')).toBeNull()
  })

  test('renders project name when showProjectName is true', () => {
    render(
      <CondensedMissionRow 
        mission={mockMission} 
        showProjectName={true}
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    )

    expect(screen.getByText('Awesome Project')).toBeDefined()
  })
})
