'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, GripVertical, Square, PlayCircle, CheckSquare } from 'lucide-react'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import { updateTask, reorderTasks, createTask, deleteTask as deleteTaskAction } from '@/app/missions/actions'
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
  status: 'todo' | 'in_progress' | 'done'
  estimation: number
  position: number
}

interface TaskListProps {
  missionId: string
}

interface SortableTaskItemProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isPending?: boolean
}

function SortableTaskItem({ task, onUpdate, onDelete, isPending }: SortableTaskItemProps) {
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

  const isDone = task.status === 'done'

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="flex items-center justify-between group py-1.5 border-b border-slate-50 dark:border-slate-800/50 last:border-0 bg-white dark:bg-slate-950"
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-500 transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        
        <Select
          value={task.status}
          onValueChange={(val: 'todo' | 'in_progress' | 'done') => onUpdate(task.id, { status: val })}
          disabled={isPending}
        >
          <SelectTrigger 
            className={`h-7 w-fit px-2 border-none bg-transparent shadow-none focus:ring-0 ${
              task.status === 'done' ? 'text-green-600 dark:text-green-400' : 
              task.status === 'in_progress' ? 'text-blue-600 dark:text-blue-400' : 
              'text-slate-400'
            }`}
            aria-label={`Statut: ${task.status === 'done' ? 'Terminé' : task.status === 'in_progress' ? 'En cours' : 'À faire'}`}
          >
            {task.status === 'todo' && <Square className="h-4 w-4" />}
            {task.status === 'in_progress' && <PlayCircle className="h-4 w-4" />}
            {task.status === 'done' && <CheckSquare className="h-4 w-4" />}
          </SelectTrigger>
          <SelectContent align="start" className="min-w-[130px]">
            <SelectItem value="todo">
              <div className="flex items-center gap-2">
                <Square className="h-3.5 w-3.5" />
                <span>À faire</span>
              </div>
            </SelectItem>
            <SelectItem value="in_progress">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-3.5 w-3.5" />
                <span>En cours</span>
              </div>
            </SelectItem>
            <SelectItem value="done">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-3.5 w-3.5" />
                <span>Terminé</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <InlineEditableField
          value={task.title}
          onSave={async (newTitle) => {
            await onUpdate(task.id, { title: newTitle })
          }}
          trigger="doubleClick"
          className="flex-1"
          isExternalPending={isPending}
          displayClassName={isDone ? 'line-through text-muted-foreground' : 'text-slate-700 dark:text-slate-200'}
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={task.estimation}
            step="0.5"
            min="0"
            className="h-7 w-12 text-[11px] font-bold text-center px-1 bg-slate-50 dark:bg-slate-900 border-none shadow-none"
            onChange={(e) => onUpdate(task.id, { estimation: parseFloat(e.target.value) || 0 })}
            disabled={isPending}
          />
          <span className="text-[9px] font-bold text-slate-400 uppercase">J</span>
        </div>

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
      </div>
    </div>
  )
}

export function TaskList({ missionId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set())
  const supabase = createClient()

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
        status: 'todo',
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
          {tasks.filter(t => t.status === 'done').length} / {tasks.length}
        </span>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <SortableTaskItem 
                key={task.id} 
                task={task} 
                onUpdate={handleUpdateTask} 
                onDelete={deleteTask} 
                isPending={pendingTaskIds.has(task.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
    </div>
  )
}
