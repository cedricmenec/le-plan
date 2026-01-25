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

    expect(screen.getByText(/Aujourd'hui/i)).toBeDefined()
    expect(screen.getByText(/3 févr\./i)).toBeDefined()
    expect(screen.getByText(/8 févr\./i)).toBeDefined()
    expect(screen.getByText(/5 jours/i)).toBeDefined()
  })

  test('displays danger state when estimated > desired', () => {
    render(
      <MissionTimeline 
        estimation={5} 
        estimatedDelivery="2026-02-10" // +17 days
        desiredDelivery="2026-02-03"   // +10 days
      />
    )

    // Check for danger indicator or color class
    const dangerIcon = screen.getByTestId('timeline-danger-icon')
    expect(dangerIcon).toBeDefined()
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
    expect(screen.getByText(/3 févr\./i)).toBeDefined()
  })
})
