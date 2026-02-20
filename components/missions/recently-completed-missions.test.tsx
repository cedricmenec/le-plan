import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecentlyCompletedMissions } from './recently-completed-missions'

// Mock the server action
vi.mock('@/app/projects/actions', () => ({
  getRecentlyCompletedMissions: vi.fn(),
}))

describe('RecentlyCompletedMissions', () => {
  it('renders the component with title and filter', () => {
    render(<RecentlyCompletedMissions projectId="1" initialMissions={[]} />)
    expect(screen.getByText('Missions Récemment Terminées')).toBeDefined()
    expect(screen.getByText('∞')).toBeDefined()
  })

  it('renders a message when no missions are found', () => {
    render(<RecentlyCompletedMissions projectId="1" initialMissions={[]} />)
    expect(screen.getByText('Aucune mission terminée récemment.')).toBeDefined()
  })

  it('renders missions when provided', () => {
    const mockMissions = [
      {
        id: '1',
        title: 'Mission 1',
        type: 'Feature',
        state: 'Terminated',
        reason: 'Done',
        subtasks: [{ estimation: 2, is_completed: true }],
        project_id: '1',
        user_id: 'u1',
        created_at: '2026-02-01T10:00:00Z',
        status_history: [
          { status: 'Active', created_at: '2026-02-01T10:00:00Z' },
          { status: 'Terminated', created_at: '2026-02-10T10:00:00Z' }
        ]
      }
    ]
    render(<RecentlyCompletedMissions projectId="1" initialMissions={mockMissions as any} />)
    expect(screen.getByText('Mission 1')).toBeDefined()
    expect(screen.getByText('Feature')).toBeDefined()
    expect(screen.getByText('2j')).toBeDefined() // Actual Load
    expect(screen.getByText('9j')).toBeDefined() // Duration (10 - 1 = 9 days)

    // Check link
    const link = screen.getByRole('link', { name: /Mission 1/i })
    expect(link.getAttribute('href')).toBe('/missions/1')
  })
})
