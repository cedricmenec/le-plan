import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest'
import { cn, formatRelativeDuration, sortMissions, calculateTimelineMetrics } from './utils'

test('cn merges class names correctly', () => {
  expect(cn('c1', 'c2')).toBe('c1 c2')
  expect(cn('c1', { c2: true, c3: false })).toBe('c1 c2')
  expect(cn('p-4', 'p-2')).toBe('p-2') // tailwind-merge check
})

describe('formatRelativeDuration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Set system time to 2026-01-24
    vi.setSystemTime(new Date('2026-01-24T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('returns "n/a" if date is null', () => {
    expect(formatRelativeDuration(null)).toBe('n/a')
  })

  test('returns number of days if less than 14 days', () => {
    const d5 = new Date('2026-01-29T12:00:00Z') // +5 days
    expect(formatRelativeDuration(d5)).toBe('5 jours')

    const d13 = new Date('2026-02-06T12:00:00Z') // +13 days
    expect(formatRelativeDuration(d13)).toBe('13 jours')
  })

  test('returns singular "1 jour" if exactly 1 day', () => {
    const d1 = new Date('2026-01-25T12:00:00Z') // +1 day
    expect(formatRelativeDuration(d1)).toBe('1 jour')
  })

  test('returns "0 jour" if today', () => {
    const today = new Date('2026-01-24T15:00:00Z')
    expect(formatRelativeDuration(today)).toBe('0 jour')
  })

  test('handles past dates with "en retard"', () => {
    const past = new Date('2026-01-20T12:00:00Z')
    expect(formatRelativeDuration(past)).toContain('retard')
  })

  test('returns approximate weeks if between 14 and 30 days', () => {
    const d14 = new Date('2026-02-07T12:00:00Z') // 14 days -> 2 weeks
    expect(formatRelativeDuration(d14)).toBe('~ 2 semaines')

    const d20 = new Date('2026-02-13T12:00:00Z') // 20 days -> 3 weeks
    expect(formatRelativeDuration(d20)).toBe('~ 3 semaines')

    const d25 = new Date('2026-02-18T12:00:00Z') // 25 days -> 4 semaines (or 1 month? let's stick to spec)
    expect(formatRelativeDuration(d25)).toBe('~ 4 semaines')
  })

  test('returns approximate months if 30 days or more', () => {
    const d30 = new Date('2026-02-23T12:00:00Z') // 30 days
    expect(formatRelativeDuration(d30)).toBe('~ 1 mois')

    const d45 = new Date('2026-03-10T12:00:00Z') // 45 days -> 1.5 mois
    expect(formatRelativeDuration(d45)).toBe('~ 1,5 mois')

    const d75 = new Date('2026-04-09T12:00:00Z') // 75 days -> 2.5 mois
    expect(formatRelativeDuration(d75)).toBe('~ 2,5 mois')
  })
})

describe('sortMissions', () => {
  const missions = [
    { id: '1', title: 'M1', created_at: '2026-01-20T10:00:00Z', estimated_delivery_date: '2026-02-01' },
    { id: '2', title: 'M2', created_at: '2026-01-21T10:00:00Z', estimated_delivery_date: null },
    { id: '3', title: 'M3', created_at: '2026-01-19T10:00:00Z', estimated_delivery_date: '2026-01-30' },
    { id: '4', title: 'M4', created_at: '2026-01-22T10:00:00Z', estimated_delivery_date: null },
  ]

  test('sorts by delivery date ascending, then created_at descending', () => {
    // @ts-ignore - limited fields for test
    const sorted = sortMissions(missions)
    
    // Expected order:
    // 1. M3 (2026-01-30)
    // 2. M1 (2026-02-01)
    // 3. M4 (No date, created 01-22)
    // 4. M2 (No date, created 01-21)
    
    expect(sorted[0].id).toBe('3')
    expect(sorted[1].id).toBe('1')
    expect(sorted[2].id).toBe('4')
    expect(sorted[3].id).toBe('2')
  })
})

describe('calculateTimelineMetrics', () => {
  const today = new Date('2026-01-24T12:00:00Z')

  test('returns null if both dates are missing', () => {
    // @ts-ignore - testing with nulls
    const metrics = calculateTimelineMetrics(today, 5, null, null)
    expect(metrics).toBeNull()
  })

  test('calculates correct percentages when both dates are present', () => {
    const estimated = '2026-02-03' // Today + 10 days
    const desired = '2026-02-08'   // Today + 15 days
    // Timeline window: 15 days
    
    // @ts-ignore
    const metrics = calculateTimelineMetrics(today, 5, estimated, desired)
    
    expect(metrics).not.toBeNull()
    if (metrics) {
      expect(metrics.effortPercentage).toBeCloseTo((5 / 15) * 100)
      expect(metrics.estimatedPercentage).toBeCloseTo((10 / 15) * 100)
      expect(metrics.desiredPercentage).toBe(100)
      expect(metrics.isDanger).toBe(false)
    }
  })

  test('detects danger when estimated > desired', () => {
    const estimated = '2026-02-10' // Today + 17 days
    const desired = '2026-02-03'   // Today + 10 days
    // Timeline window: 17 days
    
    // @ts-ignore
    const metrics = calculateTimelineMetrics(today, 5, estimated, desired)
    
    expect(metrics).not.toBeNull()
    if (metrics) {
      expect(metrics.isDanger).toBe(true)
      expect(metrics.estimatedPercentage).toBe(100)
      expect(metrics.desiredPercentage).toBeCloseTo((10 / 17) * 100)
    }
  })

  test('handles missing estimated date', () => {
    const desired = '2026-02-03' // Today + 10 days
    // @ts-ignore
    const metrics = calculateTimelineMetrics(today, 3, null, desired)
    
    expect(metrics).not.toBeNull()
    if (metrics) {
      expect(metrics.estimatedPercentage).toBeNull()
      expect(metrics.desiredPercentage).toBe(100)
      expect(metrics.effortPercentage).toBeCloseTo((3 / 10) * 100)
    }
  })

  test('handles missing desired date', () => {
    const estimated = '2026-02-03' // Today + 10 days
    // @ts-ignore
    const metrics = calculateTimelineMetrics(today, 3, estimated, null)
    
    expect(metrics).not.toBeNull()
    if (metrics) {
      expect(metrics.estimatedPercentage).toBe(100)
      expect(metrics.desiredPercentage).toBeNull()
      expect(metrics.effortPercentage).toBeCloseTo((3 / 10) * 100)
    }
  })
})
