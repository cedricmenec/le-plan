import { expect, test, vi } from 'vitest'
import { getProjects, getProject, createProject, updateProject, deleteProject } from './actions'

const mockSelect = vi.fn((query) => ({
  order: vi.fn(() => Promise.resolve({ data: [], error: null })),
  eq: vi.fn(() => ({
    single: vi.fn(() => Promise.resolve({ data: { id: '1', name: 'Test Project' }, error: null })),
    select: vi.fn(() => ({
      single: vi.fn(() => Promise.resolve({ data: {}, error: null }))
    }))
  }))
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: mockSelect,
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: '1', name: 'Test' }, error: null }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: {}, error: null }))
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-1' } }, error: null }))
    }
  }))
}))

test('exports are defined', () => {
  expect(getProjects).toBeDefined()
  expect(getProject).toBeDefined()
  expect(createProject).toBeDefined()
  expect(updateProject).toBeDefined()
  expect(deleteProject).toBeDefined()
})

test('getProjects calls select with correct query', async () => {
  await getProjects()
  expect(mockSelect).toHaveBeenCalledWith('*, missions(*, subtasks(*))')
})

test('getProject returns a project and calls select with correct query', async () => {
  const project = await getProject('1')
  expect(project).toBeDefined()
  expect(project.name).toBe('Test Project')
  expect(mockSelect).toHaveBeenCalledWith('*, missions(*, projects(name), subtasks(*))')
})