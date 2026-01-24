'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import { updateTask, reorderTasks } from '@/app/missions/actions'
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

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="flex items-center justify-between group py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-0 bg-white dark:bg-slate-950"
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-500 transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <Checkbox 
          id={task.id} 
          checked={task.is_completed} 
          onCheckedChange={() => onUpdate(task.id, { is_completed: !task.is_completed })}
          className="h-5 w-5"
          disabled={isPending}
        />
        <InlineEditableField
          value={task.title}
          onSave={async (newTitle) => {
            await onUpdate(task.id, { title: newTitle })
          }}
          trigger="doubleClick"
          className="flex-1"
          isExternalPending={isPending}
          displayClassName={task.is_completed ? 'line-through text-muted-foreground' : 'text-slate-700 dark:text-slate-200'}
        />
      </div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
        onClick={() => onDelete(task.id)}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
      </Button>
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
    const { data, error } = await supabase
      .from('subtasks')
      .insert({ 
        mission_id: missionId, 
        title: newTitle,
        position: maxPosition + 1
      })
      .select()
      .single()

    if (!error && data) {
      setTasks([...tasks, data])
      setNewTitle('')
    }
  }

  async function handleUpdateTask(id: string, updates: Partial<Task>) {
    const previousTasks = [...tasks]
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t))

    try {
      await updateTask(id, updates)
    } catch (error) {
      console.error('Error updating task:', error)
      setTasks(previousTasks)
    }
  }

  async function deleteTask(id: string) {
    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', id)

    if (!error) {
      setTasks(tasks.filter(t => t.id !== id))
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
          {tasks.filter(t => t.is_completed).length} / {tasks.length}
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
