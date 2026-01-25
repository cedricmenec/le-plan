import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { expect, test, vi, describe, beforeAll } from 'vitest'
import { MissionDetailMilestones } from './mission-detail-milestones'
import { Milestone } from './mission-milestone-item'

// Mock dependencies
vi.mock('@/app/missions/actions', () => ({
  deleteMilestone: vi.fn(() => Promise.resolve()),
  createMilestone: vi.fn(() => Promise.resolve()),
  updateMilestone: vi.fn(() => Promise.resolve()),
  getMilestoneTypes: vi.fn(() => Promise.resolve([{ id: 't1', name: 'Type 1' }]))
}))

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}))

// Mock MissionMilestoneItem to bypass hover delay in this integration test
vi.mock('./mission-milestone-item', () => ({
  MissionMilestoneItem: ({ milestone, onEdit, onDelete }: any) => (
    <div>
      <span>{milestone.title}</span>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  )
}))

// Mock ResizeObserver for Radix UI Dialog
beforeAll(() => {
  global.ResizeObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
})

const mockMilestones: Milestone[] = [
  {
    id: '1',
    mission_id: 'm1',
    type_id: 't1',
    date: '2026-02-01',
    title: 'Future Milestone',
    note: 'Note 1',
    created_at: '',
    milestone_types: { name: 'Type 1' }
  }
]

describe('MissionDetailMilestones Integration', () => {
  test('opens EditMilestoneDialog when edit is clicked', async () => {
    render(<MissionDetailMilestones missionId="m1" initialMilestones={mockMilestones} />)
    
    const editBtn = screen.getByText('Edit')
    fireEvent.click(editBtn)
    
    expect(await screen.findByText('Modifier le jalon')).toBeDefined()
  })

  test('calls deleteMilestone when delete is clicked', async () => {
    const { deleteMilestone } = await import('@/app/missions/actions')
    
    render(<MissionDetailMilestones missionId="m1" initialMilestones={mockMilestones} />)
    
    const deleteBtn = screen.getByText('Delete')
    fireEvent.click(deleteBtn)
    
    expect(deleteMilestone).toHaveBeenCalledWith('m1', '1')
  })
})
