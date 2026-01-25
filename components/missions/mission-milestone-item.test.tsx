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
    
    // Initially hidden (opacity-0)
    const actionsWrapper = screen.getByTestId('milestone-actions').parentElement!
    expect(actionsWrapper.className).toContain('opacity-0')
    
    const itemContainer = screen.getByText('Test Milestone').closest('.group')!
    
    // Hover start
    fireEvent.mouseEnter(itemContainer)
    
    // Still hidden after 500ms
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(actionsWrapper.className).toContain('opacity-0')
    
    // Visible after 1000ms
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(actionsWrapper.className).toContain('opacity-100')
  })

  test('clears timeout and hides button on mouse leave', async () => {
    render(<MissionMilestoneItem milestone={mockMilestone} />)
    
    const actionsWrapper = screen.getByTestId('milestone-actions').parentElement!
    const itemContainer = screen.getByText('Test Milestone').closest('.group')!
    
    fireEvent.mouseEnter(itemContainer)
    
    // Move out before 1s
    act(() => {
      vi.advanceTimersByTime(500)
    })
    fireEvent.mouseLeave(itemContainer)
    
    // Should stay hidden even after more time passes
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(actionsWrapper.className).toContain('opacity-0')
  })
})