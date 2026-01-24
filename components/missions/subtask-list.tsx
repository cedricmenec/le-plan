'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface Subtask {
  id: string
  title: string
  is_completed: boolean
}

interface SubtaskListProps {
  missionId: string
}

export function SubtaskList({ missionId }: SubtaskListProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [newTitle, setNewTitle] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function fetchSubtasks() {
      const { data, error } = await supabase
        .from('subtasks')
        .select('*')
        .eq('mission_id', missionId)
        .order('created_at', { ascending: true })

      if (!error) setSubtasks(data || [])
    }
    fetchSubtasks()
  }, [missionId, supabase])

  async function addSubtask() {
    if (!newTitle.trim()) return

    const { data, error } = await supabase
      .from('subtasks')
      .insert({ mission_id: missionId, title: newTitle })
      .select()
      .single()

    if (!error && data) {
      setSubtasks([...subtasks, data])
      setNewTitle('')
    }
  }

  async function toggleSubtask(id: string, is_completed: boolean) {
    const { error } = await supabase
      .from('subtasks')
      .update({ is_completed: !is_completed })
      .eq('id', id)

    if (!error) {
      setSubtasks(subtasks.map(s => s.id === id ? { ...s, is_completed: !is_completed } : s))
    }
  }

  async function deleteSubtask(id: string) {
    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', id)

    if (!error) {
      setSubtasks(subtasks.filter(s => s.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sous-tâches</h3>
        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium">
          {subtasks.filter(s => s.is_completed).length} / {subtasks.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center justify-between group py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id={subtask.id} 
                checked={subtask.is_completed} 
                onCheckedChange={() => toggleSubtask(subtask.id, subtask.is_completed)}
                className="h-5 w-5"
              />
              <label 
                htmlFor={subtask.id}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all ${subtask.is_completed ? 'line-through text-muted-foreground' : 'text-slate-700 dark:text-slate-200'}`}
              >
                {subtask.title}
              </label>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteSubtask(subtask.id)}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Input 
          className="h-9 text-sm" 
          placeholder="Ajouter une sous-tâche..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addSubtask()
            }
          }}
        />
        <Button 
          type="button" 
          size="icon" 
          variant="secondary" 
          className="h-9 w-9 shrink-0" 
          onClick={addSubtask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
