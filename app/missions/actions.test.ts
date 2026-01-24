import { expect, test, vi } from 'vitest'
import { getMission, updateMission } from './actions'

// Mock the supabase server client
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
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { id: 'm1', title: 'Updated Mission' },
              error: null
            }))
          }))
        }))
      }))
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

test('updateMission updates a mission', async () => {
  const mission = await updateMission('m1', { title: 'Updated Mission' })
  expect(mission.id).toBe('m1')
  expect(mission.title).toBe('Updated Mission')
})
