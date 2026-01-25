import { render, screen } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import { MissionHeaderHero, MissionHeroBlock } from './mission-header-hero'
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
    expect(titleElement.className).toContain('text-3xl')
    expect(titleElement.className).not.toContain('text-5xl')
  })

  test('hero container does not have shadow classes', () => {
    const { container } = render(
      <TooltipProvider>
        <MissionHeroBlock mission={mockMission} />
      </TooltipProvider>
    )
    
    const heroBlock = container.querySelector('.rounded-2xl.border')
    // expect(heroBlock?.className).not.toContain('shadow-') 
    // toContain on undefined or null if not found, but it should be found
    if (!heroBlock) throw new Error('heroBlock not found')
    expect(heroBlock.className).not.toContain('shadow-')
  })
})