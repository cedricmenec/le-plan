import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectHeader } from './project-header'

// Mock AddMissionDialog to avoid complex logic
vi.mock('@/components/missions/add-mission-dialog', () => ({
  AddMissionDialog: ({ children, initialProjectId, isProjectLocked }: any) => (
    <div data-testid="add-mission-dialog" data-project-id={initialProjectId} data-locked={isProjectLocked}>
      {children}
    </div>
  ),
}))

describe('ProjectHeader', () => {
  const mockProject = {
    id: 'project-1',
    name: 'Test Project',
    label: 'PROJ-1',
    description: 'A test project description'
  }

  it('renders project name and description', () => {
    render(<ProjectHeader project={mockProject} />)
    expect(screen.getByText('Test Project')).toBeDefined()
    expect(screen.getByText('A test project description')).toBeDefined()
    expect(screen.getByText('PROJ-1')).toBeDefined()
  })

  it('contains Add Mission button wrapped in AddMissionDialog with correct props', () => {
    render(<ProjectHeader project={mockProject} />)
    
    const dialog = screen.getByTestId('add-mission-dialog')
    expect(dialog.getAttribute('data-project-id')).toBe('project-1')
    expect(dialog.getAttribute('data-locked')).toBe('true')
    
    const button = screen.getByRole('button', { name: /Add Mission/i })
    expect(button).toBeDefined()
  })
})
