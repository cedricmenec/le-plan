import { expect, test, vi, beforeEach } from 'vitest'
import { getMilestoneTypes, getMilestones, createMilestone, updateMilestone, deleteMilestone } from './actions'

// Mock dependencies
const mockSelect = vi.fn()
const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    from: vi.fn((table) => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: table === 'milestone_types' ? [{ id: 't1', name: 'Type 1' }] : [], error: null })),
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          single: vi.fn(() => Promise.resolve({ data: { id: 'm1', mission_id: 'mission1' }, error: null }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'm1', mission_id: 'mission1' }, error: null }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { id: 'm1', mission_id: 'mission1' }, error: null }))
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'u1' } } }))
    }
  }))
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

test('getMilestoneTypes fetches types', async () => {
  const types = await getMilestoneTypes()
  expect(types).toHaveLength(1)
  expect(types[0].name).toBe('Type 1')
})

test('createMilestone inserts a milestone', async () => {
  const milestone = await createMilestone('mission1', { 
    title: 'New Milestone', 
    date: '2026-01-25', 
    type_id: 't1' 
  })
  expect(milestone.mission_id).toBe('mission1')
})

test('updateMilestone updates a milestone', async () => {
  const milestone = await updateMilestone('mission1', 'm1', { title: 'Updated' })
  expect(milestone.id).toBe('m1')
})

test('deleteMilestone deletes a milestone', async () => {
  await deleteMilestone('mission1', 'm1')
  // No error thrown means success in this mock
})
