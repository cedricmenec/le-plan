import { expect, test, vi, beforeEach } from 'vitest'
import { getMission, createMission, updateMission, updateTask, createTask, deleteTask, reorderTasks } from './actions'

// Mock the supabase server client
const mockInsert = vi.fn(() => ({
  select: vi.fn(() => ({
    single: vi.fn(() => Promise.resolve({
      data: { id: 'm2', title: 'New Mission', project_id: 'p1', mission_id: 'm1' },
      error: null
    }))
  }))
}))

const mockUpdate = vi.fn(() => ({
  eq: vi.fn(() => ({
    select: vi.fn(() => ({
      single: vi.fn(() => Promise.resolve({
        data: { id: 'm1', title: 'Updated Mission', mission_id: 'm1' },
        error: null
      }))
    }))
  }))
}))

const mockDelete = vi.fn(() => ({
  eq: vi.fn(() => Promise.resolve({ error: null }))
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { id: 'm1', title: 'Test Mission' },
            error: null
          }))
        }))
      })),
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'u1' } } }))
    }
  }))
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

beforeEach(() => {
  vi.clearAllMocks()
})

test('getMission fetches a mission', async () => {
  const mission = await getMission('m1')
  expect(mission.id).toBe('m1')
  expect(mission.title).toBe('Test Mission')
})

test('createMission creates a mission', async () => {
  const mission = {
    title: 'New Mission',
    type: 'feature',
    estimation: 3,
    priority: 'high' as const
  }
  const result = await createMission(mission)
  expect(result.id).toBe('m2')
  expect(mockInsert).toHaveBeenCalledWith({ ...mission, user_id: 'u1' })
})

test('updateMission updates a mission with delivery dates and priority', async () => {
  const updates = { 
    title: 'Updated Mission',
    estimated_delivery_date: '2026-06-01',
    desired_delivery_date: '2026-06-15',
    priority: 'critical' as const
  }
  await updateMission('m1', updates)
  expect(mockUpdate).toHaveBeenCalledWith(updates)
})

test('updateMission updates a mission with ROM size and load source', async () => {
  const updates = { 
    rom_size: 'M',
    load_source: 'tasks' as const
  }
  await updateMission('m1', updates)
  expect(mockUpdate).toHaveBeenLastCalledWith(updates)
})

test('updateTask updates a task', async () => {
  const updates = { title: 'Updated Task', estimation: 1, status: 'in_progress' as const }
  const task = await updateTask('t1', updates)
  expect(task.title).toBe('Updated Mission') // Based on mock data
  expect(mockUpdate).toHaveBeenCalledWith(updates)
})

test('createTask creates a task', async () => {
  const newTask = { mission_id: 'm1', title: 'New Task', position: 0 }
  const result = await createTask(newTask)
  expect(result.id).toBe('m2')
  expect(mockInsert).toHaveBeenCalledWith(newTask)
})

test('deleteTask deletes a task', async () => {
  await deleteTask('m1', 't1')
  expect(mockDelete).toHaveBeenCalled()
})

test('reorderTasks updates multiple tasks', async () => {
  await reorderTasks('m1', [
    { id: 't1', position: 0 },
    { id: 't2', position: 1 }
  ])
  expect(mockUpdate).toHaveBeenCalledTimes(2) // 2 from reorderTasks
})


