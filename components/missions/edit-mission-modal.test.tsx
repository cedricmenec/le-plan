import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, vi, beforeEach } from 'vitest'
import { EditMissionModal } from './edit-mission-modal'
import { MissionState, MissionReason } from '@prisma/client'

// Mock scrollIntoView
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
  }))
}))

// Mock MissionStateMachine
vi.mock('@/lib/missions/state-machine', () => ({
  MissionStateMachine: {
    getValidNextStates: vi.fn(() => [MissionState.Active, MissionState.Queued]),
    getValidReasons: vi.fn(() => []),
    validateStateAndReason: vi.fn(() => true),
  }
}))

const mockMission: any = {
  id: '1',
  title: 'Mission Test',
  type: 'feature',
  goal: 'Test Goal',
  notes: 'Test Notes',
  estimation: 2,
  confidence: 80,
  project_parent: 'p1',
  state: MissionState.Backlog,
  reason: null,
  status: 'todo',
  created_at: '2024-01-01',
  user_id: 'u1',
  project_id: null,
  estimated_delivery_date: null,
  desired_delivery_date: null,
  priority: 'medium' as const
}

test('renders edit mission modal with existing data', async () => {
  const onOpenChange = vi.fn()
  const onSubmit = vi.fn()
  
  render(
    <EditMissionModal 
      mission={mockMission} 
      open={true} 
      onOpenChange={onOpenChange} 
      onSubmit={onSubmit} 
    />
  )
  
  // Find title in modal
  expect(await screen.findByText(/modifier la mission/i)).toBeDefined()
  
  // Check if fields are populated
  const titleInput = screen.getByLabelText(/titre/i) as HTMLInputElement
  expect(titleInput.value).toBe(mockMission.title)

  expect(screen.getByText(/priorité/i)).toBeDefined()
  
  const estimationInput = screen.getByLabelText(/estimation/i) as HTMLInputElement
  expect(estimationInput.value).toBe(mockMission.estimation.toString())

  const goalInput = screen.getByLabelText(/objectif principal/i) as HTMLTextAreaElement
  expect(goalInput.value).toBe(mockMission.goal)

  // Submit form
  const submitBtn = screen.getByRole('button', { name: /enregistrer/i })
  fireEvent.click(submitBtn)
  
  expect(onSubmit).toHaveBeenCalled()
})
