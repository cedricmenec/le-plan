import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MissionHeaderHero } from './mission-header-hero'

vi.mock('@/app/missions/actions', () => ({
  deleteMission: vi.fn(),
  reopenMission: vi.fn(),
}))

vi.mock('@/components/missions/mission-state-actions', () => ({
  MissionStateActions: () => <div data-testid="state-actions" />,
}))

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

const baseMission = {
  id: 'm1',
  title: 'Ma mission',
  type: 'feature',
  state: 'Queued',
  queue_position: 2,
  project_id: 'p1',
  projects: { name: 'Atlas' },
}

beforeEach(() => {
  vi.clearAllMocks()
})

function renderHero(mission: Record<string, unknown>) {
  return render(
    <MemoryRouter>
      <MissionHeaderHero mission={mission} onUpdate={vi.fn()} />
    </MemoryRouter>
  )
}

describe('MissionHeaderHero — queue rank (Queued missions)', () => {
  it('should display queue rank and project queue link for a queued mission with a project', () => {
    renderHero(baseMission)

    expect(screen.getByText(/Rang/)).toBeTruthy()
    expect(screen.getByText('#3')).toBeTruthy()
    expect(screen.getByText('Voir la file du projet')).toBeTruthy()
    expect(screen.getByText('Voir la file du projet').getAttribute('href')).toBe('/projects/p1')
  })

  it('should display standalone queue wording without link for a queued mission without project', () => {
    renderHero({ ...baseMission, project_id: null, projects: null })

    expect(screen.getByText(/la file autonome/)).toBeTruthy()
    expect(screen.queryByText('Voir la file du projet')).toBeNull()
  })

  it('should not display queue rank for a non-queued mission', () => {
    renderHero({ ...baseMission, state: 'Active' })

    expect(screen.queryByText(/Rang/)).toBeNull()
    expect(screen.queryByText('Voir la file du projet')).toBeNull()
  })
})
