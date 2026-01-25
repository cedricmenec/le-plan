import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MilestoneForm } from './milestone-form'

// Mock the getMilestoneTypes action
vi.mock('@/app/missions/actions', () => ({
  getMilestoneTypes: vi.fn(() => Promise.resolve([
    { id: 't1', name: 'Type 1' },
    { id: 't2', name: 'Type 2' }
  ]))
}))

describe('MilestoneForm', () => {
  it('renders correctly with initial data', async () => {
    const onSubmit = vi.fn()
    render(
      <MilestoneForm 
        missionId="m1" 
        initialData={{ title: 'Test', date: '2026-01-25', type_id: 't1' }} 
        onSubmit={onSubmit} 
      />
    )
    
    expect(screen.getByLabelText(/Titre/)).toBeDefined()
    expect((screen.getByLabelText(/Titre/) as HTMLInputElement).value).toBe('Test')
  })
})
