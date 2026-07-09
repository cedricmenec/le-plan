import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import MissionDetail from './MissionDetail'

vi.mock('@/app/missions/actions', () => ({
  getMission: vi.fn().mockResolvedValue({
    id: 'mission-1',
    title: 'Queued detail mission',
    type: 'feature',
    estimation: 2,
    confidence: 3,
    state: 'Queued',
    reason: null,
    priority: 'medium',
    goal: null,
    notes: null,
    estimated_delivery_date: null,
    desired_delivery_date: null,
    project_id: 'project-1',
    queue_position: 1,
    project_parent: null,
    projects: { name: 'Atlas' },
    subtasks: [],
    status_history: [],
  }),
  updateMission: vi.fn(),
  getMilestones: vi.fn().mockResolvedValue([]),
  deleteMission: vi.fn(),
  reopenMission: vi.fn(),
}))

vi.mock('@/app/projects/actions', () => ({
  getProjects: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/components/missions/mission-detail-milestones', () => ({
  MissionDetailMilestones: () => <div>Milestones</div>,
}))

vi.mock('@/components/missions/status-timeline', () => ({
  StatusTimeline: () => <div>Timeline</div>,
}))

vi.mock('@/components/missions/mission-status-history-list', () => ({
  MissionStatusHistoryList: () => <div>History</div>,
}))

vi.mock('@/components/missions/task-list', () => ({
  TaskList: () => <div>Tasks</div>,
}))

describe('MissionDetail', () => {
  it('shows lifecycle and queue context in the mission detail page', async () => {
    render(
      <MemoryRouter initialEntries={['/missions/mission-1']}>
        <Routes>
          <Route path="/missions/:id" element={<MissionDetail />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Cycle de vie')).toBeDefined()
    })
    expect(screen.getByText('#2')).toBeDefined()
    expect(screen.getAllByText(/Atlas/).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /Voir la file/ }).getAttribute('href')).toBe('/projects/project-1')
  })
})
