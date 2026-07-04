import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectEmptyState } from './project-empty-state'

// Mock AddMissionDialog to avoid dealing with Radix Dialog in simple unit tests
vi.mock('@/components/missions/add-mission-dialog', () => ({
  AddMissionDialog: ({ children, initialProjectId }: { children: React.ReactNode, initialProjectId?: string }) => (
    <div data-testid="add-mission-dialog-mock" data-project-id={initialProjectId}>
      {children}
    </div>
  )
}))

describe('ProjectEmptyState', () => {
  it('renders empty state message and button', () => {
    render(<ProjectEmptyState />)
    expect(screen.getByText('No missions yet')).toBeDefined()
    expect(screen.getByText('Create First Mission')).toBeDefined()
  })

  it('passes projectId to AddMissionDialog', () => {
    const projectId = 'test-project-id'
    render(<ProjectEmptyState projectId={projectId} />)
    const mock = screen.getByTestId('add-mission-dialog-mock')
    expect(mock.getAttribute('data-project-id')).toBe(projectId)
  })

  it('renders skeleton cards in the background', () => {
    const { container } = render(<ProjectEmptyState />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
