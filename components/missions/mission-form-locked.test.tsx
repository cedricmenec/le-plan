import { render, screen, waitFor } from '@testing-library/react'
import { expect, vi, describe, it } from 'vitest'
import { MissionForm } from './mission-form'

// Mock Supabase
vi.mock('@/lib/supabase/client', () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ 
      data: [{ id: 'project-1', name: 'Locked Project', status: 'active' }], 
      error: null 
    }),
  }
  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => chain),
    })),
  }
})

describe('MissionForm with Locked Project', () => {
  it('disables project selection and shows project name when isProjectLocked is true', async () => {
    // @ts-ignore - we haven't added isProjectLocked to props yet
    render(<MissionForm initialProjectId="project-1" isProjectLocked={true} />)
    
    // We expect to see the project name 'Locked Project' 
    // and NOT the Select component that allows changing projects
    await waitFor(() => {
      expect(screen.getByText('Locked Project')).toBeDefined()
    })

    // The SelectTrigger for project_id should NOT be in the document
    // We need to be careful how we identify the select trigger. 
    // In mission-form.tsx it is: <SelectTrigger id="project_id">
    const selectTrigger = screen.queryByRole('combobox', { name: /Projet/i })
    expect(selectTrigger).toBeNull()
  })
})
