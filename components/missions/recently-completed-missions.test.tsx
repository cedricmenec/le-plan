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
        status: 'done',
        started_at: '2026-02-01T10:00:00Z',
        completed_at: '2026-02-10T10:00:00Z',
        subtasks: [{ estimation: 2, status: 'done' }],
        project_id: '1',
        user_id: 'u1',
        created_at: '2026-02-01T10:00:00Z',
        goal: null,
        notes: null,
        confidence: null,
        project_parent: null,
        estimated_delivery_date: null,
        desired_delivery_date: null,
        priority: 'medium',
        rom_size: null,
        load_source: 'tasks',
        estimation: 0,
      }
    ]
    render(<RecentlyCompletedMissions projectId="1" initialMissions={mockMissions as never} />)
    expect(screen.getByText('Mission 1')).toBeDefined()
    expect(screen.getByText('Feature')).toBeDefined()
    expect(screen.getByText('2j')).toBeDefined() // Actual Load
    expect(screen.getByText('9 days')).toBeDefined() // Duration

    // Check link
    const link = screen.getByRole('link', { name: /Mission 1/i })
    expect(link.getAttribute('href')).toBe('/missions/1')
  })
})
