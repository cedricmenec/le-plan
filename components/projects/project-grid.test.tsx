import { render, screen } from '@testing-library/react'
import { ProjectGrid } from './project-grid'
import { vi, expect, test } from 'vitest'
import { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']

vi.mock('./project-card', () => ({
  ProjectCard: ({ project }: { project: Project }) => <div>Card: {project.name}</div>
}))

// Mock Dialog/Form components if used?
vi.mock('./add-project-dialog', () => ({
  AddProjectDialog: () => <button>Add Project</button>
}))

vi.mock('./edit-project-modal', () => ({
  EditProjectModal: () => <div>Edit Modal</div>
}))

test('renders grid header and empty state', () => {
  render(<ProjectGrid projects={[]} />)
  // Expect header
  expect(screen.getByRole('heading', { name: /Projets/i })).toBeDefined()
  // Expect empty state message?
  expect(screen.getByText(/Aucun projet/i)).toBeDefined()
})

test('renders projects', () => {
const mockProjects: Project[] = [
  { id: '1', name: 'P1', status: 'active', color: '#000', created_at: '', user_id: 'u1', label: null, description: null, image_url: null }
]
  render(<ProjectGrid projects={mockProjects} />)
  expect(screen.getByText('Card: P1')).toBeDefined()
})
