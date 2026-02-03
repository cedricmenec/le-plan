import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import { MissionHeaderHero } from './mission-header-hero'
import { TooltipProvider } from '@/components/ui/tooltip'

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [] }),
        }),
      }),
    }),
  }),
}))

describe('MissionHeaderHero Actions Menu', () => {
  const mockMission = {
    id: 'm1',
    title: 'Hero Mission',
    type: 'feature',
    status: 'in_progress',
    project_id: 'p1',
    projects: { name: 'Super Project' },
  }

  test('renders menu trigger (ellipsis icon)', () => {
    render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

    // The button should have an aria-label or we look for the icon
    expect(screen.getByLabelText(/Actions de la mission/i)).toBeDefined()
  })

  test('opens dropdown menu when clicked', () => {
    render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

    const trigger = screen.getByLabelText(/Actions de la mission/i)
    fireEvent.click(trigger)

    expect(screen.getByText('Modifier')).toBeDefined()
    expect(screen.getByText('Supprimer')).toBeDefined()
  })

  test('opens EditMissionModal when clicking Modifier', () => {
    render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

    fireEvent.click(screen.getByLabelText(/Actions de la mission/i))
    fireEvent.click(screen.getByText('Modifier'))

    // Check if modal title is present
    expect(screen.getByText('Modifier la mission')).toBeDefined()
  })

  test('opens DeleteMissionDialog when clicking Supprimer', () => {
    render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

    fireEvent.click(screen.getByLabelText(/Actions de la mission/i))
    fireEvent.click(screen.getByText('Supprimer'))

    // Check if alert dialog title is present
    expect(screen.getByText('Supprimer cette mission ?')).toBeDefined()
  })
})
