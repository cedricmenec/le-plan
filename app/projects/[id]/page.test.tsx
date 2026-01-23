import { render, screen } from '@testing-library/react'
import ProjectDetailPage from './page'
import { expect, test, vi } from 'vitest'

// Mock the actions
vi.mock('../actions', () => ({
  getProject: vi.fn(() => Promise.resolve({
    id: '1',
    name: 'Test Project',
    label: 'TP',
    description: 'Test Description',
    missions: [
      { id: 'm1', status: 'in_progress', estimation: 5 },
      { id: 'm2', status: 'todo', estimation: 3 }
    ]
  }))
}))

const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  })),
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-1' } }, error: null }))
  }
}

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase))
}))

// Mock Supabase client client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockSupabase)
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  notFound: vi.fn()
}))

test('renders project detail page with dashboard', async () => {
  // In Vitest, we can just call the async component function
  const page = await ProjectDetailPage({ params: Promise.resolve({ id: '1' }) })
  render(page)
  
  expect(screen.getAllByText('Test Project').length).toBeGreaterThanOrEqual(1)
  expect(screen.getByText('TP')).toBeDefined()
  expect(screen.getByText('Test Description')).toBeDefined()
  
  // Dashboard stats
  expect(screen.getByText('8 jours')).toBeDefined()
  expect(screen.getAllByText('Missions actives').length).toBeGreaterThanOrEqual(1)
})
