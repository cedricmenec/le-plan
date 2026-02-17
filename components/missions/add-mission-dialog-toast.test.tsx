import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AddMissionDialog } from './add-mission-dialog'

// Mock useToast
const mockToast = vi.fn()
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock MissionForm
vi.mock('./mission-form', () => ({
  MissionForm: ({ onSuccess }: { onSuccess: (mission: any) => void }) => (
    <button
      onClick={() => onSuccess({ id: 'new-mission-id', title: 'New Mission' })}
    >
      Trigger Success
    </button>
  ),
}))

// Mock ToastAction and Link to avoid rendering issues
vi.mock('@/components/ui/toast', async () => {
    const actual = await vi.importActual('@/components/ui/toast') as any
    return {
        ...actual,
        ToastAction: ({ children }: any) => <div data-testid="toast-action">{children}</div>,
    }
})

vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

describe('AddMissionDialog Toast', () => {
  it('shows success toast with View Mission link on success', async () => {
    render(
      <AddMissionDialog>
        <button>Open</button>
      </AddMissionDialog>
    )
    
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(screen.getByText('Trigger Success'))
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Mission créée avec succès',
        description: 'La mission "New Mission" a été ajoutée.',
        action: expect.anything()
      }))
    })
  })
})
