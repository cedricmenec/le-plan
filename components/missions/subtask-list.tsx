'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

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

  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm font-medium mb-2">Sous-tâches</div>
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center space-x-2">
          <Checkbox 
            id={subtask.id} 
            checked={subtask.is_completed} 
            onCheckedChange={() => toggleSubtask(subtask.id, subtask.is_completed)}
          />
          <label 
            htmlFor={subtask.id}
            className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${subtask.is_completed ? 'line-through text-muted-foreground' : ''}`}
          >
            {subtask.title}
          </label>
        </div>
      ))}
      <div className="flex items-center space-x-2 mt-2">
        <Input 
          className="h-8 text-xs" 
          placeholder="Ajouter une sous-tâche..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
        />
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={addSubtask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
