import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MissionStateActions } from './mission-state-actions'
import { MissionState } from '@/lib/types'

describe('MissionStateActions', () => {
  it('offers queued mission transitions to Backlog and Active without reasons', async () => {
    const onUpdate = vi.fn().mockResolvedValue(undefined)
    render(<MissionStateActions state={MissionState.Queued} onUpdate={onUpdate} />)

    fireEvent.pointerDown(screen.getByRole('button'))

    expect(await screen.findByText('Backlog')).toBeDefined()
    expect(screen.getByText('Active')).toBeDefined()
    expect(screen.queryByText('Bloqué')).toBeNull()
    expect(screen.queryByText('Dépriorisé')).toBeNull()

    fireEvent.click(screen.getByText('Active'))

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith({ state: MissionState.Active, reason: null })
    })
  })
})
