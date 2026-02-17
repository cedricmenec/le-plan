import { render, screen } from '@testing-library/react'
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest'
import { MissionTimeline } from './mission-timeline'

describe('MissionTimeline', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-24T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('renders nothing if both dates are missing', () => {
    const { container } = render(
      <MissionTimeline 
        estimation={5} 
        estimatedDelivery={null} 
        desiredDelivery={null} 
      />
    )
    expect(container.firstChild).toBeNull()
  })

  test('renders timeline with dates and effort', () => {
    render(
      <MissionTimeline 
        estimation={5} 
        estimatedDelivery="2026-02-03" // +10 days
        desiredDelivery="2026-02-08"   // +15 days
      />
    )

    expect(screen.getByText(/Timeline & Scheduling/i)).toBeDefined()
    expect(screen.getByText(/TODAY/i)).toBeDefined()
    expect(screen.getByText(/2026-02-03/i)).toBeDefined()
    expect(screen.getByText(/2026-02-08/i)).toBeDefined()
    expect(screen.getByText(/5 days remaining/i)).toBeDefined()
  })

  test('displays danger state when estimated > desired', () => {
    render(
      <MissionTimeline 
        estimation={5} 
        estimatedDelivery="2026-02-10" // +17 days
        desiredDelivery="2026-02-03"   // +10 days
      />
    )

    // Check for Critical Delay text in orange
    expect(screen.getByText(/Critical Delay/i)).toBeDefined()
  })

  test('handles missing estimated date', () => {
    render(
      <MissionTimeline 
        estimation={3} 
        estimatedDelivery={null} 
        desiredDelivery="2026-02-03" 
      />
    )

    expect(screen.queryByText(/n\/a/i)).toBeNull() // Should show date for desired
    expect(screen.getByText(/2026-02-03/i)).toBeDefined()
  })

  test('renders in readonly mode correctly', () => {
    render(
      <MissionTimeline 
        estimation={5} 
        estimatedDelivery="2026-02-03" 
        desiredDelivery="2026-02-08"
        readonly={true}
      />
    )

    // Should show "total duration" instead of "remaining"
    expect(screen.getByText(/5 days total duration/i)).toBeDefined()
    expect(screen.queryByText(/remaining/i)).toBeNull()

    // Should NOT show "TODAY"
    expect(screen.queryByText(/TODAY/i)).toBeNull()
  })
})
