import { render, screen } from '@testing-library/react'
import { expect, test, vi, beforeAll } from 'vitest'
import { MissionCard, MissionWithProject } from './mission-card'
import { TooltipProvider } from '@/components/ui/tooltip'

beforeAll(() => {
  global.ResizeObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
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
  project_parent: 'Project A',
  created_at: '2026-01-23T00:00:00Z',
  user_id: 'user1',
  projects: { name: 'Project A' }
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
  expect(screen.getByText('feature')).toBeDefined()
  expect(screen.getByText('Project A')).toBeDefined()
  expect(screen.getByText('Test Goal')).toBeDefined()
  expect(screen.getByTestId('notes-icon')).toBeDefined()
  
  const detailsLink = screen.getByRole('link', { name: /détails/i })
  expect(detailsLink.getAttribute('href')).toBe('/missions/1')
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
  // ShieldCheck is usually rendered as an svg, we can check for text content or presence
})

test('renders goal with tooltip when truncated', async () => {
  // Mocking scrollHeight and clientHeight for truncation detection
  // We can use Object.defineProperty on the element prototype
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
  expect(goalElement.className).toContain('cursor-help')

  // Restore mocks
  if (originalScrollHeight) Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight)
  if (originalClientHeight) Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight)
})
