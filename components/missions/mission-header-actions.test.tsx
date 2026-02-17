import { render, screen, fireEvent, act } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import { MissionHeaderHero } from './mission-header-hero'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MissionState } from '@prisma/client'

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

// Mock MissionStateActions
vi.mock('./mission-state-actions', () => ({
  MissionStateActions: ({ state }: any) => <div data-testid="state-actions">{state}</div>
}))

// Mock DropdownMenu to avoid Portal issues in tests
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div data-testid="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuSub: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSubTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSubContent: ({ children }: any) => <div>{children}</div>,
}))

describe('MissionHeaderHero Actions Menu', () => {
  const mockMission = {
    id: 'm1',
    title: 'Hero Mission',
    type: 'feature',
    state: MissionState.Active,
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

    expect(screen.getByText('Modifier')).toBeDefined()
    expect(screen.getByText('Supprimer')).toBeDefined()
  })

  test('opens EditMissionModal when clicking Modifier', () => {
    render(
      <TooltipProvider>
        <MissionHeaderHero mission={mockMission} onUpdate={async () => {}} />
      </TooltipProvider>
    )

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

    fireEvent.click(screen.getByText('Supprimer'))

    // Check if alert dialog title is present
    expect(screen.getByText('Supprimer cette mission ?')).toBeDefined()
  })
})
