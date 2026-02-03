import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MissionMilestoneList } from './mission-milestone-list'
import { Milestone } from './mission-milestone-item'

const mockMilestones: Milestone[] = [
  {
    id: '1',
    mission_id: 'm1',
    type_id: 't1',
    date: '2026-12-01', // Future
    title: 'Future Milestone',
    note: 'Note 1',
    created_at: '',
    milestone_types: { name: 'Cadrage / Kick-off' }
  },
  {
    id: '2',
    mission_id: 'm1',
    type_id: 't2',
    date: '2025-01-01', // Past
    title: 'Past Milestone',
    note: null,
    created_at: '',
    milestone_types: { name: 'Réunion / Review' }
  }
]

describe('MissionMilestoneList', () => {
  it('renders only upcoming milestones by default', () => {
    render(<MissionMilestoneList milestones={mockMilestones} />)
    
    expect(screen.getByText('Future Milestone')).toBeDefined()
    expect(screen.queryByText('Past Milestone')).toBeNull()
  })

  it('shows all milestones when clicking "Voir les jalons passés"', () => {
    render(<MissionMilestoneList milestones={mockMilestones} />)
    
    const showAllBtn = screen.getByText(/VOIR LES JALONS PASSÉS/)
    fireEvent.click(showAllBtn)
    
    expect(screen.getByText('Future Milestone')).toBeDefined()
    expect(screen.getByText('Past Milestone')).toBeDefined()
  })

  it('can collapse back to upcoming only', () => {
    render(<MissionMilestoneList milestones={mockMilestones} />)
    
    fireEvent.click(screen.getByText(/VOIR LES JALONS PASSÉS/))
    fireEvent.click(screen.getByText('VOIR SEULEMENT LES JALONS À VENIR'))
    
    expect(screen.queryByText('Past Milestone')).toBeNull()
  })

  it('renders a placeholder when no upcoming milestones', () => {
    render(<MissionMilestoneList milestones={[mockMilestones[1]]} />)
    expect(screen.getByText('Aucun jalon prévu pour le moment.')).toBeDefined()
  })
})
