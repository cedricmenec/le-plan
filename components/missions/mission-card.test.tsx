import { render, screen } from '@testing-library/react'
import { expect, test, vi, beforeAll, describe, beforeEach, afterEach } from 'vitest'
import { MissionCard, MissionWithProject } from './mission-card'
import { TooltipProvider } from '@/components/ui/tooltip'

beforeAll(() => {
  global.ResizeObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
})

describe('MissionCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-24T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mockMission: MissionWithProject = {
    id: '1',
    title: 'Test Mission',
    type: 'feature',
    status: 'todo',
    estimation: 2,
    confidence: 85,
    goal: 'Test Goal',
    notes: 'Test Notes',
    project_parent: 'p1',
    created_at: new Date().toISOString(),
    user_id: 'user-1',
    project_id: 'p1',
    priority: 'medium',
    projects: {
      name: 'Project 1'
    },
    estimated_delivery_date: null,
    desired_delivery_date: null
  }

  test('renders mission card with basic info', () => {
    render(
      <TooltipProvider>
        <MissionCard 
          mission={mockMission} 
          onEdit={() => {}} 
          onDelete={() => {}} 
        />
      </TooltipProvider>
    )

    expect(screen.getByText('Test Mission')).toBeDefined()
    expect(screen.getByText(/FEATURE/i)).toBeDefined()
    expect(screen.getByText(/PROJECT A/i)).toBeDefined()
    expect(screen.getByText('Test Goal')).toBeDefined()
    expect(screen.getByTestId('notes-icon')).toBeDefined()
    
    // Check for status badge and footer status
    expect(screen.getAllByText(/TODO/i).length).toBeGreaterThanOrEqual(2)

    // Ensure "Avancement" is NOT there
    expect(screen.queryByText(/avancement/i)).toBeNull()
    
    const detailsLink = screen.getByRole('link', { name: /DETAILS/i })
    expect(detailsLink.getAttribute('href')).toBe('/missions/1')
  })

  test('displays relative delivery duration when estimated_delivery_date is set', () => {
    const missionWithDate = { 
      ...mockMission, 
      estimated_delivery_date: '2026-01-29' // +5 days
    }
    render(
      <TooltipProvider>
        <MissionCard 
          mission={missionWithDate} 
          onEdit={() => {}} 
          onDelete={() => {}} 
        />
      </TooltipProvider>
    )

    expect(screen.getByText(/5 jours/i)).toBeDefined()
  })

  test('does not render notes icon when notes are empty', () => {
    const missionWithoutNotes = { ...mockMission, notes: null }
    render(
      <TooltipProvider>
        <MissionCard 
          mission={missionWithoutNotes} 
          onEdit={() => {}} 
          onDelete={() => {}} 
        />
      </TooltipProvider>
    )

    expect(screen.queryByTestId('notes-icon')).toBeNull()
  })

  test('displays high confidence with ShieldCheck', () => {
    render(
      <TooltipProvider>
        <MissionCard 
          mission={mockMission} 
          onEdit={() => {}} 
          onDelete={() => {}} 
        />
      </TooltipProvider>
    )
    
    expect(screen.getByText('85%')).toBeDefined()
  })

  test('renders goal with tooltip when truncated', async () => {
    const originalScrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight')
    const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')

    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 100 })
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 50 })
    
    const missionWithLongGoal = { 
      ...mockMission, 
      goal: 'This is a very long goal that should definitely be truncated.' 
    }
    
    render(
      <TooltipProvider>
        <MissionCard 
          mission={missionWithLongGoal} 
          onEdit={() => {}} 
          onDelete={() => {}} 
        />
      </TooltipProvider>
    )

    const goalElement = screen.getByText(missionWithLongGoal.goal)
    expect(goalElement).toBeDefined()
    expect(goalElement.className).toContain('line-clamp-3')
    expect(goalElement.className).toContain('cursor-help')

    if (originalScrollHeight) Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight)
    if (originalClientHeight) Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight)
  })
})
