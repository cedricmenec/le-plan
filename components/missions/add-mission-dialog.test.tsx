import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddMissionDialog } from './add-mission-dialog'
import { describe, it, expect, vi } from 'vitest'

// Mock MissionForm
vi.mock('./mission-form', () => ({
  MissionForm: ({ onSuccess, initialProjectId, isProjectLocked }: { 
    onSuccess: () => void, 
    initialProjectId?: string,
    isProjectLocked?: boolean
  }) => (
    <div data-testid="mission-form">
      <div data-testid="initial-project-id">{initialProjectId}</div>
      <div data-testid="is-project-locked">{isProjectLocked ? 'true' : 'false'}</div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSuccess({ id: '123', title: 'Mock Mission' } as any)
        }}
      >
        <button type="submit">Submit</button>
      </form>
    </div>
  ),
}))

describe('AddMissionDialog', () => {
  it('renders trigger button', () => {
    render(<AddMissionDialog><button>Trigger</button></AddMissionDialog>)
    expect(screen.getByText('Trigger')).toBeDefined()
  })

  it('opens dialog on trigger click', async () => {
    render(<AddMissionDialog><button>Trigger</button></AddMissionDialog>)
    
    fireEvent.click(screen.getByText('Trigger'))
    
    await waitFor(() => {
      expect(screen.getByTestId('mission-form')).toBeDefined()
    })
  })

  it('passes initialProjectId and isProjectLocked to MissionForm', async () => {
    render(
      <AddMissionDialog initialProjectId="project-1" isProjectLocked={true}>
        <button>Trigger</button>
      </AddMissionDialog>
    )
    
    fireEvent.click(screen.getByText('Trigger'))
    
    await waitFor(() => {
      expect(screen.getByTestId('initial-project-id').textContent).toBe('project-1')
      expect(screen.getByTestId('is-project-locked').textContent).toBe('true')
    })
  })

  it('closes dialog on successful submission', async () => {
    render(<AddMissionDialog><button>Trigger</button></AddMissionDialog>)
    
    fireEvent.click(screen.getByText('Trigger'))
    
    await waitFor(() => {
        expect(screen.getByTestId('mission-form')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(screen.queryByTestId('mission-form')).toBeNull()
    })
  })
})
