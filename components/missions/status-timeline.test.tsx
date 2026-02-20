import { render, screen } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { StatusTimeline } from './status-timeline'
import { MissionState, MissionReason } from '@prisma/client'

describe('StatusTimeline', () => {
  const mockHistory = [
    { 
      status: MissionState.Active, 
      created_at: new Date('2026-02-19T10:00:00Z').toISOString() as any
    },
    { 
      status: MissionState.Suspended, 
      reason: MissionReason.Blocked, 
      created_at: new Date('2026-02-19T11:00:00Z').toISOString() as any
    },
    { 
      status: MissionState.Active, 
      created_at: new Date('2026-02-19T12:00:00Z').toISOString() as any
    },
    { 
      status: MissionState.Suspended, 
      reason: MissionReason.Deprioritized, 
      created_at: new Date('2026-02-19T13:00:00Z').toISOString() as any
    },
    { 
      status: MissionState.Terminated, 
      created_at: new Date('2026-02-19T14:00:00Z').toISOString() as any
    },
  ]

  test('renders status timeline with title', () => {
    render(<StatusTimeline history={mockHistory} />)
    expect(screen.getByText(/Audit du Cycle de Vie/i)).toBeDefined()
  })

  test('renders segments for each state', () => {
    const { container } = render(<StatusTimeline history={mockHistory} />)
    
    // 4 intervals: 
    // 1. Active (10:00-11:00) -> 1h
    // 2. Blocked (11:00-12:00) -> 1h
    // 3. Active (12:00-13:00) -> 1h
    // 4. Paused (13:00-14:00) -> 1h
    // Total 4h. Each segment should be 25%

    const segments = container.querySelectorAll('.status-segment')
    expect(segments.length).toBe(4)
    
    // Check classes/colors (conceptually, we'll use specific classes for testing)
    expect(segments[0].className).toContain('bg-slate-900') // Active
    expect(segments[1].className).toContain('bg-rose-500')  // Blocked
    expect(segments[2].className).toContain('bg-slate-900') // Active
    expect(segments[3].className).toContain('bg-slate-300')  // Paused
  })

  test('handles empty history', () => {
    render(<StatusTimeline history={[]} />)
    expect(screen.queryByText(/Audit du Cycle de Vie/i)).toBeNull()
  })
})
