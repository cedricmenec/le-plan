import { expect, test, vi } from 'vitest'
import { getMission, updateMission, updateTask, reorderTasks } from './actions'

// Mock the supabase server client
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

test('updateMission updates a mission with delivery dates', async () => {
  const updates = { 
    title: 'Updated Mission',
    estimated_delivery_date: '2026-06-01',
    desired_delivery_date: '2026-06-15'
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

