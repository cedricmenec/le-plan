import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueuedMissionList } from './queued-mission-list'
import { reorderQueue } from '@/app/missions/actions'

vi.mock('@/app/missions/actions', () => ({
  reorderQueue: vi.fn(),
}))

vi.mock('@dnd-kit/core', () => ({
  closestCenter: vi.fn(),
  DndContext: ({ children, onDragEnd }: any) => (
    <div>
      <button type="button" onClick={() => onDragEnd({ active: { id: 'first' }, over: { id: 'second' } })}>
        simulate pointer reorder
      </button>
      {children}
    </div>
  ),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => <>{children}</>,
  verticalListSortingStrategy: {},
  arrayMove: (items: any[], from: number, to: number) => {
    const next = [...items]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return next
  },
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
  }),
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}))

const missions = [
  { id: 'first', title: 'First queued', queue_position: 0, project_id: 'project-1', projects: { name: 'Atlas' } },
  { id: 'second', title: 'Second queued', queue_position: 1, project_id: 'project-1', projects: { name: 'Atlas' } },
] as any

describe('QueuedMissionList', () => {
  beforeEach(() => {
    vi.mocked(reorderQueue).mockReset()
    vi.mocked(reorderQueue).mockResolvedValue([])
  })

  it('opens queued mission detail from the row without using drag or move controls', () => {
    render(<MemoryRouter><QueuedMissionList missions={missions} projectId="project-1" /></MemoryRouter>)

    expect(screen.getByRole('link', { name: 'First queued' }).getAttribute('href')).toBe('/missions/first')
    expect(screen.getByRole('button', { name: 'Déplacer First queued' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Descendre First queued' })).toBeDefined()
  })

  it('persists keyboard reorder within the same scope', async () => {
    render(<MemoryRouter><QueuedMissionList missions={missions} projectId="project-1" /></MemoryRouter>)

    fireEvent.click(screen.getByRole('button', { name: 'Descendre First queued' }))

    await waitFor(() => {
      expect(reorderQueue).toHaveBeenCalledWith('project-1', ['second', 'first'])
    })
  })

  it('persists pointer reorder within the same scope', async () => {
    render(<MemoryRouter><QueuedMissionList missions={missions} projectId="project-1" /></MemoryRouter>)

    fireEvent.click(screen.getByRole('button', { name: 'simulate pointer reorder' }))

    await waitFor(() => {
      expect(reorderQueue).toHaveBeenCalledWith('project-1', ['second', 'first'])
    })
  })

  it('rolls back to the previous visible order when persistence fails', async () => {
    vi.mocked(reorderQueue).mockRejectedValueOnce(new Error('nope'))
    render(<MemoryRouter><QueuedMissionList missions={missions} projectId="project-1" /></MemoryRouter>)

    fireEvent.click(screen.getByRole('button', { name: 'Descendre First queued' }))

    await waitFor(() => {
      const rows = screen.getAllByRole('link').map(link => within(link).getByText(/queued/).textContent)
      expect(rows).toEqual(['First queued', 'Second queued'])
    })
  })
})
