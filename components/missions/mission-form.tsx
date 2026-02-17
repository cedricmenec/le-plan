'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Database } from '@/types/database.types'
import { PrioritySelect } from './priority-select'
import { PriorityLevel } from './priority-badge'
import { createMission } from '@/app/missions/actions'

type Project = Database['public']['Tables']['projects']['Row']

const MISSION_TYPES = [
  { value: 'feature', label: 'Feature' },
  { value: 'study', label: 'Étude' },
  { value: 'support', label: 'Support' },
  { value: 'docs', label: 'Documentation' },
  { value: 'other', label: 'Autre' },
]

interface MissionFormProps {
  onSuccess?: (mission: any) => void
  initialProjectId?: string
  isProjectLocked?: boolean
}

export function MissionForm({ onSuccess, initialProjectId, isProjectLocked }: MissionFormProps) {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [dateWarning, setDateWarning] = useState<string | null>(null)
  const [priority, setPriority] = useState<PriorityLevel>('medium')
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(initialProjectId)
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

  const currentProject = projects.find(p => p.id === selectedProjectId)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDateWarning(null)
    
    // Capture the form element synchronously — React's synthetic event is released after awaits
    const form = event.currentTarget as HTMLFormElement

    const formData = new FormData(form)
    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const goal = formData.get('goal') as string
    const notes = formData.get('notes') as string
    const estimated_delivery_date = formData.get('estimated_delivery_date') as string || null
    const desired_delivery_date = formData.get('desired_delivery_date') as string || null
    const estimation = parseFloat(formData.get('estimation') as string)
    const confidence = parseFloat(formData.get('confidence') as string)
    const project_id_raw = formData.get('project_id') as string
    const project_id = project_id_raw === 'none' ? null : project_id_raw

    // Basic date validation
    if (estimated_delivery_date) {
      const d = new Date(estimated_delivery_date)
      if (isNaN(d.getTime())) {
        alert('Date de livraison estimée invalide (format attendu: YYYY-MM-DD)')
        return
      }
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (d < today) {
        setDateWarning("Attention: La date de livraison estimée est dans le passé.")
      }
    }

    if (desired_delivery_date) {
      const d = new Date(desired_delivery_date)
      if (isNaN(d.getTime())) {
        alert('Date de livraison souhaitée invalide (format attendu: YYYY-MM-DD)')
        return
      }
    }

    setLoading(true)

    try {
      const mission = await createMission({
        title,
        type,
        goal,
        notes,
        estimation,
        confidence,
        project_id,
        estimated_delivery_date,
        desired_delivery_date,
        priority,
      })

      form.reset()
      setPriority('medium')
      // notify sibling components (e.g. MissionList) to refetch their data
      window.dispatchEvent(new CustomEvent('missions:created'))
      if (onSuccess) onSuccess(mission)
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la création de la mission')
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

      <div className="space-y-2">
        <Label>Priorité</Label>
        <PrioritySelect value={priority} onValueChange={setPriority} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal">Main Goal</Label>
        <Textarea id="goal" name="goal" placeholder="Objectif principal de la mission" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Notes complémentaires" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimated_delivery_date">Date de Livraison Estimée</Label>
          <Input 
            id="estimated_delivery_date" 
            name="estimated_delivery_date" 
            type="text" 
            placeholder="YYYY-MM-DD" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desired_delivery_date">Date de livraison souhaitée</Label>
          <Input 
            id="desired_delivery_date" 
            name="desired_delivery_date" 
            type="text" 
            placeholder="YYYY-MM-DD" 
          />
        </div>
      </div>

      {dateWarning && (
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
          {dateWarning}
        </p>
      )}

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
        {isProjectLocked ? (
          <div className="flex items-center gap-2">
            <div className="h-9 w-full rounded-md border border-input bg-muted/50 px-3 py-1 text-sm flex items-center text-muted-foreground">
              {currentProject?.name || 'Chargement...'}
            </div>
            <input type="hidden" name="project_id" value={selectedProjectId} />
          </div>
        ) : (
          <Select name="project_id" value={selectedProjectId || "none"} onValueChange={(v) => setSelectedProjectId(v === "none" ? undefined : v)}>
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
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Création...' : 'Créer la Mission'}
      </Button>
    </form>
  )
}
