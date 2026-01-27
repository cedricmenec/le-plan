import { render, screen } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import { MissionHeaderHero, MissionHeroBlock } from './mission-header-hero'
import { TooltipProvider } from '@/components/ui/tooltip'

// Mock MissionTimeline to simplify testing
vi.mock('./mission-timeline', () => ({
  MissionTimeline: () => <div data-testid="mission-timeline" />
}))

describe('MissionHeaderHero & MissionHeroBlock', () => {
  const mockMission = {
    id: 'm1',
    title: 'Hero Mission',
    type: 'feature',
    status: 'in_progress',
    estimation: 5,
    confidence: 90,
    estimated_delivery_date: '2026-02-01',
    desired_delivery_date: '2026-02-05',
    project_id: 'p1',
    projects: { name: 'Super Project' },
    rom_size: 'M',
    load_source: 'rom',
    subtasks: [
      { id: 't1', status: 'todo', estimation: 2 },
      { id: 't2', status: 'done', estimation: 1 }
    ]
  }

  test('renders mission title and project name', () => {
    render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

    expect(screen.getByText('Hero Mission')).toBeDefined()
    expect(screen.getByText('Super Project')).toBeDefined()
  })

  test('renders mission type and status badges', () => {
    render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

    expect(screen.getByText(/FEATURE/i)).toBeDefined()
    expect(screen.getByText(/EN COURS/i)).toBeDefined()
  })

  test('renders estimation controls and values in MissionHeroBlock', () => {
    render(
      <TooltipProvider>
        <MissionHeroBlock mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

    // ROM display (M)
    expect(screen.getByText(/M \(~5j\)/i)).toBeDefined()
    // Official source toggle display
    expect(screen.getByText(/T-SHIRT \(ROM\)/i)).toBeDefined()
    
    // Comparison values
    expect(screen.getByText('5j')).toBeDefined() // ROM M = 5
    expect(screen.getByText('2j')).toBeDefined() // Tasks: t1(2) + t2(done, ignore) = 2
  })

  test('shows smart suggestion when ROM is official but tasks exist', () => {
    render(
      <TooltipProvider>
        <MissionHeroBlock mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

    expect(screen.getByText(/Passer à la charge par tâches \(2j\) \?/i)).toBeDefined()
  })

  test('renders confidence score discreetly in MissionHeroBlock', () => {
    render(
      <TooltipProvider>
        <MissionHeroBlock mission={mockMission} />
      </TooltipProvider>
    )

    expect(screen.getByText('90%')).toBeDefined()
  })

  test('integrates MissionTimeline in MissionHeroBlock', () => {
    render(
      <TooltipProvider>
        <MissionHeroBlock mission={mockMission} />
      </TooltipProvider>
    )

    expect(screen.getByTestId('mission-timeline')).toBeDefined()
  })
})