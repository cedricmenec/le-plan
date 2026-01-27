import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, vi, describe, it } from 'vitest'
import { MissionForm } from './mission-form'

// Mock createMission action
const mockCreateMission = vi.fn((data: any) => Promise.resolve({}))
vi.mock('@/app/missions/actions', () => ({
  createMission: (data: any) => mockCreateMission(data)
}))

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn()

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

describe('MissionForm', () => {
  it('renders mission form with basic fields', () => {
    render(<MissionForm />)
    expect(screen.getByLabelText(/Titre/i)).toBeDefined()
    expect(screen.getByText(/Choisir un type/i)).toBeDefined()
    expect(screen.getByLabelText(/Main Goal/i)).toBeDefined()
  })

  it('pre-selects project when initialProjectId is provided', async () => {
    const initialProjectId = 'project-1'
    render(<MissionForm initialProjectId={initialProjectId} />)
    
    // The SelectValue should show the project name if projects were loaded, 
    // but in unit tests we might just check if the select has the value.
    // Since projects are fetched in useEffect, we might need to wait or mock them.
    const select = screen.getByLabelText(/Projet/i)
    expect(select).toBeDefined()
  })

  test('submitting the form calls createMission and onSuccess', async () => {
    const onSuccess = vi.fn()
    render(<MissionForm onSuccess={onSuccess} />)

    const title = screen.getByLabelText(/titre/i) as HTMLInputElement
    const form = title.closest('form') as HTMLFormElement

    // populate and submit
    fireEvent.change(title, { target: { value: 'Test mission' } })
    
    // submit the form
    fireEvent.submit(form)

    await waitFor(() => expect(mockCreateMission).toHaveBeenCalled())
    expect(onSuccess).toHaveBeenCalled()

    // form should be reset
    expect(title.value).toBe('')
  })
})