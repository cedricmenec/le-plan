import { render, screen } from '@testing-library/react'
import { ProjectCard } from './project-card'
import { expect, test, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
// Mission state types (replaces @prisma/client)
type MissionState = 'Backlog' | 'Queued' | 'Active' | 'Suspended' | 'Terminated'
type MissionReason = 'Done' | 'Cancelled' | 'Blocked' | 'Deprioritized' | null

const mockProject = {
  id: '1',
  name: 'Test Project',
  label: 'Marketing',
  description: 'Test Description',
  status: 'active',
  color: '#000',
  created_at: new Date().toISOString(),
  user_id: 'user-1',
  image_url: null
}

const mockMissions = [
  {
    id: 'm1',
    title: 'Active Mission',
    state: 'Active' as MissionState,
    reason: null,
    estimated_delivery_date: '2026-01-30',
    created_at: '',
    user_id: 'u1',
    type: 'feature',
    confidence: 100,
    project_id: '1',
    estimation: 3,
    goal: null,
    notes: null,
    desired_delivery_date: null,
    priority: 'medium',
    project_parent: null,
    rom_size: null,
    load_source: 'tasks',
  },
  {
    id: 'm2',
    title: 'Upcoming Mission',
    state: 'Backlog' as MissionState,
    reason: null,
    estimated_delivery_date: null,
    created_at: '',
    user_id: 'u1',
    type: 'study',
    confidence: 100,
    project_id: '1',
    estimation: 2,
    goal: null,
    notes: null,
    desired_delivery_date: null,
    priority: 'low',
    project_parent: null,
    rom_size: null,
    load_source: 'tasks',
  }
]

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

test('renders project name and label', () => {
  renderWithRouter(
    <ProjectCard 
      project={mockProject as any} 
      missions={mockMissions as any}
      onEdit={vi.fn()} 
      onDelete={vi.fn()} 
    />
  )
  expect(screen.getByText('Test Project')).toBeDefined()
  expect(screen.getByText('Marketing')).toBeDefined()
})

test('renders active missions list', () => {
  renderWithRouter(
    <ProjectCard 
      project={mockProject as any} 
      missions={mockMissions as any} 
      onEdit={vi.fn()} 
      onDelete={vi.fn()} 
    />
  )
  expect(screen.getByText('Active Mission')).toBeDefined()
  expect(screen.queryByText('Upcoming Mission')).toBeNull() // Should only show in-progress
})

test('renders project image when image_url is provided', () => {
  const projectWithImage = { ...mockProject, image_url: 'https://example.com/image.jpg' }
  renderWithRouter(
    <ProjectCard 
      project={projectWithImage as any} 
      missions={mockMissions as any}
      onEdit={vi.fn()} 
      onDelete={vi.fn()} 
    />
  )
  const img = screen.getByAltText('Test Project') as HTMLImageElement
  expect(img.src).toBe('https://example.com/image.jpg')
})

test('renders upcoming missions count', () => {
  renderWithRouter(
    <ProjectCard 
      project={mockProject as any} 
      missions={mockMissions as any} 
      onEdit={vi.fn()} 
      onDelete={vi.fn()} 
    />
  )
  expect(screen.getByText(/1 MISSION À VENIR/i)).toBeDefined()
})
