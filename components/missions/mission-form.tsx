'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']

const MISSION_TYPES = [
  { value: 'feature', label: 'Feature' },
  { value: 'study', label: 'Étude' },
  { value: 'support', label: 'Support' },
  { value: 'docs', label: 'Documentation' },
  { value: 'other', label: 'Autre' },
]

interface MissionFormProps {
  onSuccess?: () => void
}

export function MissionForm({ onSuccess }: MissionFormProps) {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('name')
      
      setProjects(data || [])
    }
    fetchProjects()
  }, [supabase])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    // Capture the form element synchronously — React's synthetic event is released after awaits
    const form = event.currentTarget as HTMLFormElement

    const formData = new FormData(form)
    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const estimation = parseFloat(formData.get('estimation') as string)
    const confidence = parseFloat(formData.get('confidence') as string)
    const project_id_raw = formData.get('project_id') as string
    const project_id = project_id_raw === 'none' ? null : project_id_raw

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Vous devez être connecté')
        return
      }

      const { error } = await supabase
        .from('missions')
        .insert({
          title,
          type,
          estimation,
          confidence,
          project_id,
          user_id: user.id,
        })

      if (error) {
        alert('Erreur lors de la création de la mission')
      } else {
        // Use the captured form reference instead of `event` (which may be null after awaits)
        form.reset()
        // notify sibling components (e.g. MissionList) to refetch their data
        window.dispatchEvent(new CustomEvent('missions:created'))
        if (onSuccess) onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" placeholder="Nom de la mission" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select name="type" required>
          <SelectTrigger id="type">
            <SelectValue placeholder="Choisir un type" />
          </SelectTrigger>
          <SelectContent>
            {MISSION_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimation">Estimation (jours)</Label>
          <Input id="estimation" name="estimation" type="number" step="0.5" defaultValue="1" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confidence">Confiance (%)</Label>
          <Input id="confidence" name="confidence" type="number" min="0" max="100" defaultValue="100" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_id">Projet (Optionnel)</Label>
        <Select name="project_id">
          <SelectTrigger id="project_id">
            <SelectValue placeholder="Aucun projet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun projet</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Création...' : 'Créer la Mission'}
      </Button>
    </form>
  )
}
