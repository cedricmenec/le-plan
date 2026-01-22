import { render, screen } from '@testing-library/react'
import { DashboardHeader } from './dashboard-header'
import { describe, it, expect } from 'vitest'

describe('DashboardHeader', () => {
  it('renders title and description', () => {
    render(<DashboardHeader />)
    expect(screen.getByText('Active Missions')).toBeDefined()
    expect(screen.getByText(/Track progress and manage/i)).toBeDefined()
  })

  it('renders filter button', () => {
    render(<DashboardHeader />)
    expect(screen.getByText('Filter')).toBeDefined()
  })

  it('renders quick add button', () => {
    render(<DashboardHeader />)
    expect(screen.getByText('Quick Add Mission')).toBeDefined()
  })
})
