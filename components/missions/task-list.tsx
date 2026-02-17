'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, GripVertical, Square, PlayCircle, CheckSquare, History } from 'lucide-react'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import { updateTask, reorderTasks, createTask, deleteTask as deleteTaskAction } from '@/app/missions/actions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Task {
  id: string
  title: string
  is_completed: boolean
  estimation: number
  position: number
}

interface TaskListProps {
  missionId: string
  readonly?: boolean
}

interface SortableTaskItemProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isPending?: boolean
  readonly?: boolean
}

function SortableTaskItem({ task, onUpdate, onDelete, isPending, readonly }: SortableTaskItemProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  }

  const isDone = task.is_completed

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="flex items-center justify-between group py-1.5 border-b border-slate-50 dark:border-slate-800/50 last:border-0 bg-white dark:bg-slate-950"
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div 
          {...attributes} 
          {...(readonly ? {} : listeners)} 
          className={`p-1 -ml-1 transition-colors ${
            readonly 
              ? 'text-slate-100 dark:text-slate-900 cursor-default' 
              : 'text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-500 cursor-grab active:cursor-grabbing'
          }`}
        >
          <GripVertical className="h-4 w-4" />
        </div>
        
        <Checkbox 
          checked={task.is_completed}
          onCheckedChange={(checked) => !readonly && onUpdate(task.id, { is_completed: !!checked })}
          disabled={isPending || readonly}
          className="h-4 w-4"
        />

        <InlineEditableField
          value={task.title}
          onSave={async (newTitle) => {
            if (!readonly) await onUpdate(task.id, { title: newTitle })
          }}
          trigger={readonly ? "none" : "doubleClick"}
          className="flex-1"
          isExternalPending={isPending}
          displayClassName={isDone ? 'line-through text-slate-300 dark:text-slate-700' : 'text-slate-700 dark:text-slate-200'}
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Popover open={!readonly && isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverAnchor asChild>
              <div 
                onDoubleClick={() => !readonly && setIsPopoverOpen(true)}
                className={`px-1.5 py-0.5 rounded transition-colors text-[11px] font-bold min-w-[2rem] text-center ${
                  readonly 
                    ? 'text-slate-400 dark:text-slate-600 cursor-default' 
                    : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {task.estimation}
              </div>
            </PopoverAnchor>
            <PopoverContent className="w-24 p-2" side="top">
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Estimation (J)</div>
                <Input
                  type="number"
                  defaultValue={task.estimation}
                  step="0.5"
                  min="0"
                  autoFocus
                  className="h-8 text-xs font-bold text-center"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseFloat((e.target as HTMLInputElement).value) || 0
                      onUpdate(task.id, { estimation: val })
                      setIsPopoverOpen(false)
                    }
                  }}
                  onBlur={(e) => {
                    const val = parseFloat(e.target.value) || 0
                    if (val !== task.estimation) {
                      onUpdate(task.id, { estimation: val })
                    }
                  }}
                  disabled={isPending}
                />
              </div>
            </PopoverContent>
          </Popover>
          <span className="text-[9px] font-bold text-slate-400 uppercase">J</span>
        </div>

        {!readonly && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(task.id)}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function TaskList({ missionId, readonly }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set())
  const [showCompleted, setShowCompleted] = useState(false)
  const supabase = createClient()

  const { filteredTasks, hasDoneTasks } = useMemo(() => {
    const doneTasks = tasks.filter(t => t.is_completed)
    return {
      filteredTasks: showCompleted ? tasks : tasks.filter(t => !t.is_completed),
      hasDoneTasks: doneTasks.length > 0
    }
  }, [tasks, showCompleted])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    async function fetchTasks() {
      // Direct call to actions or supabase for now (legacy)
      const { data, error } = await supabase
        .from('subtasks')
        .select('*')
        .eq('mission_id', missionId)
        .order('position', { ascending: true })

      if (!error) setTasks(data || [])
    }
    fetchTasks()
  }, [missionId, supabase])

  async function addTask() {
    if (!newTitle.trim()) return

    const maxPosition = tasks.length > 0 ? Math.max(...tasks.map(t => t.position)) : -1
    try {
      const data = await createTask({ 
        mission_id: missionId, 
        title: newTitle,
        position: maxPosition + 1,
        is_completed: false,
        estimation: 0.5
      })

      if (data) {
        setTasks([...tasks, data as Task])
        setNewTitle('')
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  async function handleUpdateTask(id: string, updates: Partial<Task>) {
    const previousTasks = [...tasks]
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } as Task : t))

    try {
      await updateTask(id, updates)
    } catch (error) {
      console.error('Error updating task:', error)
      setTasks(previousTasks)
    }
  }

  async function deleteTask(id: string) {
    const previousTasks = [...tasks]
    setTasks(tasks.filter(t => t.id !== id))

    try {
      await deleteTaskAction(missionId, id)
    } catch (error) {
      console.error('Error deleting task:', error)
      setTasks(previousTasks)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    if (readonly) return

    const { active, over } = event

    if (over && active.id !== over.id) {
      const activeId = String(active.id)
      const oldIndex = tasks.findIndex((t) => t.id === active.id)
      const newIndex = tasks.findIndex((t) => t.id === over.id)

      const newTasks = arrayMove(tasks, oldIndex, newIndex)
      
      setTasks(newTasks)
      
      // Mark the moved task as pending
      setPendingTaskIds(prev => new Set(prev).add(activeId))

      const updates = newTasks.map((task, index) => ({
        id: task.id,
        position: index,
      }))

      try {
        await reorderTasks(missionId, updates)
      } catch (error) {
        console.error('Error reordering tasks:', error)
      } finally {
        // Remove from pending
        setPendingTaskIds(prev => {
          const next = new Set(prev)
          next.delete(activeId)
          return next
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tâches</h3>
        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium">
          {tasks.filter(t => !t.is_completed).length} restantes / {tasks.length} au total
        </span>
      </div>

      {hasDoneTasks && (
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="w-full py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center gap-1.5 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 rounded-lg transition-all mb-2"
        >
          {showCompleted ? (
            'Masquer les tâches terminées'
          ) : (
            <>
              <History className="h-3.5 w-3.5" />
              VOIR LES TÂCHES TERMINÉES ({tasks.filter(t => t.is_completed).length})
            </>
          )}
        </button>
      )}
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={filteredTasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <SortableTaskItem 
                key={task.id} 
                task={task} 
                onUpdate={handleUpdateTask} 
                onDelete={deleteTask} 
                isPending={pendingTaskIds.has(task.id)}
                readonly={readonly}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!readonly && (
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Input 
            className="h-9 text-sm" 
            placeholder="Ajouter une tâche..." 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTask()
              }
            }}
          />
          <Button 
            type="button" 
            size="icon" 
            variant="secondary" 
            className="h-9 w-9 shrink-0" 
            onClick={addTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
