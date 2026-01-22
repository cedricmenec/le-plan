import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardHeader } from './dashboard-header'
import { describe, it, expect, vi } from 'vitest'

// Mock AddMissionDialog to verify it wraps the button
vi.mock('../missions/add-mission-dialog', () => ({
  AddMissionDialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="add-mission-dialog-mock">
      {children}
    </div>
  ),
}))

describe('DashboardHeader Integration', () => {
  it('wraps Quick Add Mission button with AddMissionDialog', () => {
    render(<DashboardHeader />)
    const button = screen.getByText('Quick Add Mission')
    expect(button.closest('[data-testid="add-mission-dialog-mock"]')).toBeDefined()
  })
})
