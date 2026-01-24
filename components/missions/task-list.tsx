'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface Task {
  id: string
  title: string
  is_completed: boolean
  position: number
}

interface TaskListProps {
  missionId: string
}

export function TaskList({ missionId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState('')
  const supabase = createClient()

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

  async function toggleTask(id: string, is_completed: boolean) {
    const { error } = await supabase
      .from('subtasks')
      .update({ is_completed: !is_completed })
      .eq('id', id)

    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !is_completed } : t))
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tâches</h3>
        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium">
          {tasks.filter(t => t.is_completed).length} / {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between group py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id={task.id} 
                checked={task.is_completed} 
                onCheckedChange={() => toggleTask(task.id, task.is_completed)}
                className="h-5 w-5"
              />
              <label 
                htmlFor={task.id}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all ${task.is_completed ? 'line-through text-muted-foreground' : 'text-slate-700 dark:text-slate-200'}`}
              >
                {task.title}
              </label>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}
      </div>

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