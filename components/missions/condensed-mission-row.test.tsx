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
    desired_delivery_date: null,
    rom_size: 'M',
    load_source: 'tasks',
    subtasks: [
      { id: 't1', status: 'todo', estimation: 1, title: 'T1', position: 0, created_at: '', mission_id: '1' }
    ]
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
    // Task source: T1(1j) = 1j
    expect(screen.getByText('1j')).toBeDefined()
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

  test('displays ROM estimation correctly according to spec', () => {
    const romMission: MissionWithProject = {
      ...mockMission,
      load_source: 'rom',
      rom_size: 'M', // M = 5j
    }
    render(
      <CondensedMissionRow 
        mission={romMission} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    )

    expect(screen.getByText('5j')).toBeDefined()
    expect(screen.queryByText(/M \(~5j\)/i)).toBeNull()
  })

  test('displays Tasks estimation correctly according to spec', () => {
    const tasksMission: MissionWithProject = {
      ...mockMission,
      load_source: 'tasks',
      subtasks: [
        { id: 's1', title: 'T1', estimation: 1, status: 'todo' } as any,
        { id: 's2', title: 'T2', estimation: 0.5, status: 'in_progress' } as any,
      ]
    }
    render(
      <CondensedMissionRow 
        mission={tasksMission} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    )

    // Sum of remaining: 1 + 0.5 = 1.5j
    expect(screen.getByText('1.5j')).toBeDefined()
  })
})
