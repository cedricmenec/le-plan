import { render, screen } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import { MissionHeaderHero } from './mission-header-hero'
import { TooltipProvider } from '@/components/ui/tooltip'

// Mock MissionTimeline
vi.mock('./mission-timeline', () => ({
  MissionTimeline: () => <div data-testid="mission-timeline" />
}))

describe('MissionHeaderHero UI Polishing', () => {
  const mockMission = {
    id: 'm1',
    title: 'Hero Mission',
    type: 'feature',
    status: 'in_progress',
    projects: { name: 'Super Project' }
  }

  test('mission title uses text-3xl font size', () => {
    render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )
    
    const titleElement = screen.getByText('Hero Mission')
    // The InlineEditableField renders a span or similar with the displayClassName
    // We expect it to have text-3xl
    expect(titleElement.className).toContain('text-3xl')
    expect(titleElement.className).not.toContain('text-5xl')
  })

  test('hero container does not have shadow classes', () => {
    const { container } = render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )
    
    // The hero block is the one with p-8 md:p-10 rounded-2xl border
    // We search for the div that had shadow-md
    const heroBlock = container.querySelector('.rounded-2xl.border')
    expect(heroBlock?.className).not.toContain('shadow-')
  })
})
