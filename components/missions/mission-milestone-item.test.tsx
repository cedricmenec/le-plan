import { render, screen, fireEvent, act } from '@testing-library/react'
import { expect, test, vi, describe, beforeEach, afterEach } from 'vitest'
import { MissionMilestoneItem, Milestone } from './mission-milestone-item'

// Mock MilestoneActions to simplify testing the hover logic
vi.mock('./milestone-actions', () => ({
  MilestoneActions: ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => (
    <div data-testid="milestone-actions">
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  )
}))

const mockMilestone: Milestone = {
  id: '1',
  mission_id: 'm1',
  type_id: 't1',
  date: '2026-02-01',
  title: 'Test Milestone',
  note: 'Test Note',
  created_at: '',
  milestone_types: { name: 'Cadrage / Kick-off' }
}

describe('MissionMilestoneItem Hover Logic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('shows action button only after 1s hover', async () => {
    render(<MissionMilestoneItem milestone={mockMilestone} />)
    
    // Initially hidden
    expect(screen.queryByTestId('milestone-actions')).toBeNull()
    
    const container = screen.getByText('Test Milestone').closest('div')!
    
    // Hover start
    fireEvent.mouseEnter(container)
    
    // Still hidden after 500ms
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(screen.queryByTestId('milestone-actions')).toBeNull()
    
    // Visible after 1000ms
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(screen.getByTestId('milestone-actions')).toBeDefined()
  })

  test('clears timeout and hides button on mouse leave', async () => {
    render(<MissionMilestoneItem milestone={mockMilestone} />)
    
    const container = screen.getByText('Test Milestone').closest('div')!
    
    fireEvent.mouseEnter(container)
    
    // Move out before 1s
    act(() => {
      vi.advanceTimersByTime(500)
    })
    fireEvent.mouseLeave(container)
    
    // Should stay hidden even after more time passes
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.queryByTestId('milestone-actions')).toBeNull()
  })
})
