import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddMissionDialog } from './add-mission-dialog'
import { describe, it, expect, vi } from 'vitest'

// Mock MissionForm
vi.mock('./mission-form', () => ({
  MissionForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <form
      data-testid="mission-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSuccess()
      }}
    >
      <button type="submit">Submit</button>
    </form>
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
