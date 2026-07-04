import { useEffect, useState, useMemo } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, GripVertical, Square, PlayCircle, CheckSquare, History } from 'lucide-react'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import { updateTask, reorderTasks, createTask, deleteTask as deleteTaskAction } from '@/app/missions/actions'
import { getSubtasks } from '@/lib/db'
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
      </div>
    </div>
  )
}

export function TaskList({ missionId, readonly }: TaskListProps) {
  return <div />
}