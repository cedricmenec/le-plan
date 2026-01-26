import { expect, test, vi } from 'vitest'
import { getMission, createMission, updateMission, updateTask, reorderTasks } from './actions'

// Mock the supabase server client
const mockInsert = vi.fn(() => ({
  select: vi.fn(() => ({
    single: vi.fn(() => Promise.resolve({
      data: { id: 'm2', title: 'New Mission', project_id: 'p1' },
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
      update: mockUpdate
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

test('updateTask updates a task', async () => {
  const task = await updateTask('t1', { title: 'Updated Task' })
  expect(task.title).toBe('Updated Mission') // Based on mock data
  expect(mockUpdate).toHaveBeenCalled()
})

test('reorderTasks updates multiple tasks', async () => {
  await reorderTasks('m1', [
    { id: 't1', position: 0 },
    { id: 't2', position: 1 }
  ])
  expect(mockUpdate).toHaveBeenCalledTimes(4) // 1 from updateMission + 1 from updateTask + 2 from reorderTasks
})

