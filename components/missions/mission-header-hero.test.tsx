import { render, screen } from '@testing-library/react'
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest'
import { MissionHeaderHero } from './mission-header-hero'
import { TooltipProvider } from '@/components/ui/tooltip'

// Mock MissionTimeline to simplify testing
vi.mock('./mission-timeline', () => ({
  MissionTimeline: () => <div data-testid="mission-timeline" />
}))

describe('MissionHeaderHero', () => {
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
    projects: { name: 'Super Project' }
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

  test('renders confidence score discreetly', () => {
    render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

    expect(screen.getByText('90%')).toBeDefined()
  })

  test('integrates MissionTimeline', () => {
    render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

    expect(screen.getByTestId('mission-timeline')).toBeDefined()
  })
})
