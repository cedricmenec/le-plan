import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MissionLifecycle } from './mission-lifecycle'

describe('MissionLifecycle', () => {
  it('shows queued rank, scope and project navigation', () => {
    render(<MemoryRouter><MissionLifecycle mission={{ state: 'Queued', queue_position: 1, project_id: 'p1', projects: { name: 'Atlas' } }} /></MemoryRouter>)
    expect(screen.getByText('#2')).toBeDefined()
    expect(screen.getByText(/Atlas/)).toBeDefined()
    expect(screen.getByRole('link', { name: /Voir la file/ }).getAttribute('href')).toBe('/projects/p1')
  })
  it('represents suspension as a branch and displays its reason', () => {
    render(<MemoryRouter><MissionLifecycle mission={{ state: 'Suspended', reason: 'Blocked' }} /></MemoryRouter>)
    expect(screen.getByText('Suspended · Blocked').getAttribute('aria-current')).toBe('step')
  })
})
