import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { MissionForm } from './mission-form'

// Mock Supabase
vi.mock('@/lib/supabase/client', () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
    insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
  }
  return {
    createClient: vi.fn(() => ({
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-1' } } })),
      },
      from: vi.fn(() => chain),
    })),
  }
})

test('renders mission form with basic fields', () => {
  render(<MissionForm />)

  expect(screen.getByLabelText(/titre/i)).toBeDefined()
  expect(screen.getByLabelText(/type/i)).toBeDefined()
  expect(screen.getByLabelText(/estimation/i)).toBeDefined()
  expect(screen.getByLabelText(/projet/i)).toBeDefined()
})

test('submitting the form calls onSuccess and resets fields', async () => {
  const onSuccess = vi.fn()
  render(<MissionForm onSuccess={onSuccess} />)

  const title = screen.getByLabelText(/titre/i) as HTMLInputElement
  const estimation = screen.getByLabelText(/estimation/i) as HTMLInputElement
  const form = title.closest('form') as HTMLFormElement

  // populate and submit
  fireEvent.change(title, { target: { value: 'Test mission' } })
  expect(title.value).toBe('Test mission')

  // submit the form programmatically
  fireEvent.submit(form)

  // wait for onSuccess to have been called
  const { waitFor } = await import('@testing-library/react')
  await waitFor(() => expect(onSuccess).toHaveBeenCalled())

  // form should be reset: title cleared, estimation back to its default
  expect(title.value).toBe('')
  expect(estimation.value).toBe('1')
})
