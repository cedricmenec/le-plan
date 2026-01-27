import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MissionSkeletonCard } from './mission-skeleton-card'

describe('MissionSkeletonCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<MissionSkeletonCard />)
    expect(container.firstChild).toBeDefined()
    // Check for animate-pulse class manually if needed, or just rely on render
    const element = container.firstChild as HTMLElement
    expect(element.classList.contains('animate-pulse')).toBe(true)
  })
})
