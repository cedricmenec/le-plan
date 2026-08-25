import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { TaskList } from './task-list'
import * as actions from '@/app/missions/actions'
import { getSubtasks, type Subtask } from '@/lib/db'

vi.mock('@/app/missions/actions', () => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  reorderTasks: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/db', () => ({
  getSubtasks: vi.fn(),
}))

vi.mock('@dnd-kit/core', () => ({
  closestCenter: vi.fn(),
  DndContext: ({ children }: any) => <div>{children}</div>,
  useSensors: () => [],
  useSensor: () => ({}),
  PointerSensor: class {},
  KeyboardSensor: class {},
}))

vi.mock('@dnd-kit/sortable', () => ({
  arrayMove: (arr: unknown[], from: number, to: number) => {
    const copy = [...arr]
    const [item] = copy.splice(from, 1)
    copy.splice(to, 0, item)
    return copy
  },
  SortableContext: ({ children }: any) => <div>{children}</div>,
  sortableKeyboardCoordinates: vi.fn(),
  verticalListSortingStrategy: vi.fn(),
  useSortable: () => ({ attributes: {}, listeners: {}, setNodeRef: vi.fn(), transform: null, transition: undefined, isDragging: false }),
}))

vi.mock('@/components/ui/inline-editable-field/inline-editable-field', () => ({
  InlineEditableField: ({ value }: any) => <span>{value}</span>,
}))

const task = (overrides: Partial<Subtask> = {}): Subtask => ({
  id: 't1',
  mission_id: 'm1',
  title: 'Tâche 1',
  is_completed: false,
  estimation: 1,
  position: 0,
  status: 'todo',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TaskList', () => {
  it('should render tasks loaded from the database', async () => {
    vi.mocked(getSubtasks).mockResolvedValue([
      task({ id: 't1', title: 'Analyser le besoin' }),
      task({ id: 't2', title: 'Rédiger la spec', position: 1 }),
    ])

    render(<TaskList missionId="m1" />)

    await waitFor(() => {
      expect(screen.getByText('Analyser le besoin')).toBeTruthy()
    })
    expect(screen.getByText('Rédiger la spec')).toBeTruthy()
    expect(screen.getByText(/2 restantes \/ 2 au total/)).toBeTruthy()
  })

  it('should count only non-completed tasks as remaining and show completed toggle', async () => {
    vi.mocked(getSubtasks).mockResolvedValue([
      task({ id: 't1', title: 'À faire' }),
      task({ id: 't2', title: 'Terminée', is_completed: true, position: 1 }),
    ])

    render(<TaskList missionId="m1" />)

    await waitFor(() => {
      expect(screen.getByText(/1 restantes \/ 2 au total/)).toBeTruthy()
    })

    // Completed tasks hidden by default
    expect(screen.queryByText('Terminée')).toBeNull()

    // Toggle shows them
    fireEvent.click(screen.getByText(/VOIR LES TÂCHES TERMINÉES \(1\)/))
    expect(screen.getByText('Terminée')).toBeTruthy()
    expect(screen.getByText('Masquer les tâches terminées')).toBeTruthy()
  })

  it('should create a task with max position + 1 and default estimation 0.5', async () => {
    vi.mocked(getSubtasks).mockResolvedValue([task()])
    vi.mocked(actions.createTask).mockResolvedValue(
      task({ id: 't2', title: 'Nouvelle tâche', position: 1, estimation: 0.5 })
    )

    render(<TaskList missionId="m1" />)

    await waitFor(() => {
      expect(screen.getByText('Tâche 1')).toBeTruthy()
    })

    const input = screen.getByPlaceholderText('Ajouter une tâche...')
    fireEvent.change(input, { target: { value: 'Nouvelle tâche' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(actions.createTask).toHaveBeenCalledWith({
        mission_id: 'm1',
        title: 'Nouvelle tâche',
        position: 1,
        is_completed: false,
        estimation: 0.5,
      })
    })
    expect(screen.getByText('Nouvelle tâche')).toBeTruthy()
  })

  it('should call updateTask when toggling completion via checkbox', async () => {
    vi.mocked(getSubtasks).mockResolvedValue([task()])
    vi.mocked(actions.updateTask).mockResolvedValue(undefined)

    render(<TaskList missionId="m1" />)

    await waitFor(() => {
      expect(screen.getByText('Tâche 1')).toBeTruthy()
    })

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(actions.updateTask).toHaveBeenCalledWith('t1', { is_completed: true })
    })
  })

  it('should call deleteTask with missionId and task id on delete click', async () => {
    vi.mocked(getSubtasks).mockResolvedValue([task()])
    vi.mocked(actions.deleteTask).mockResolvedValue(undefined)

    render(<TaskList missionId="m1" />)

    await waitFor(() => {
      expect(screen.getByText('Tâche 1')).toBeTruthy()
    })

    // Delete button = the button without visible label (the toggle has text content)
    const deleteButton = screen.getAllByRole('button').find(b => !b.textContent)
    expect(deleteButton).toBeTruthy()
    fireEvent.click(deleteButton!)

    await waitFor(() => {
      expect(actions.deleteTask).toHaveBeenCalledWith('m1', 't1')
    })
    await waitFor(() => {
      expect(screen.queryByText('Tâche 1')).toBeNull()
    })
  })

  it('should render no interactive controls in readonly mode', async () => {
    vi.mocked(getSubtasks).mockResolvedValue([task()])

    render(<TaskList missionId="m1" readonly />)

    await waitFor(() => {
      expect(screen.getByText('Tâche 1')).toBeTruthy()
    })

    // No add input
    expect(screen.queryByPlaceholderText('Ajouter une tâche...')).toBeNull()
    // No delete button (only none at all in readonly)
    expect(screen.queryByRole('button')).toBeNull()
    // Checkbox disabled
    expect((screen.getByRole('checkbox') as HTMLInputElement).disabled).toBe(true)
  })
})
