import { render, screen } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { CondensedMissionRow } from './condensed-mission-row'
import { MissionWithProject } from './mission-card'

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
    created_at: '2026-01-23T00:00:00Z',
    user_id: 'user1',
    projects: { name: 'Awesome Project' },
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
    expect(screen.getByText('1.5 j')).toBeDefined()
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

  test('renders link to detail page', () => {
    render(
      <CondensedMissionRow 
        mission={mockMission} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    )

    const link = screen.getByRole('link', { name: 'Test Condensed Mission' })
    expect(link.getAttribute('href')).toBe('/missions/1')
  })
})
