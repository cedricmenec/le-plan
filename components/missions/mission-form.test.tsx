import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { MissionForm } from './mission-form'

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
    })),
  })),
}))

test('renders mission form with basic fields', () => {
  render(<MissionForm />)
  
  expect(screen.getByLabelText(/titre/i)).toBeDefined()
  expect(screen.getByLabelText(/type/i)).toBeDefined()
  expect(screen.getByLabelText(/estimation/i)).toBeDefined()
})
