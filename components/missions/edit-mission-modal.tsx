import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Trash2 } from 'lucide-react'
import { Database } from '@/types/database.types'
import { createClient } from '@/lib/supabase/client'
import { PrioritySelect } from './priority-select'
import { PriorityLevel } from './priority-badge'

type Project = Database['public']['Tables']['projects']['Row']
type Mission = Database['public']['Tables']['missions']['Row']

const MISSION_TYPES = [
  { value: 'feature', label: 'Feature' },
  { value: 'study', label: 'Étude' },
  { value: 'support', label: 'Support' },
  { value: 'docs', label: 'Documentation' },
  { value: 'other', label: 'Autre' },
]

const MISSION_STATUSES = [
  { value: 'todo', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done', label: 'Terminé' },
]

interface EditMissionModalProps {
  mission: Mission
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<Mission>) => void
  onDelete?: () => void
  loading?: boolean
}

export function EditMissionModal({
  mission,
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  loading,
}: EditMissionModalProps) {
  const [formData, setFormData] = useState<Partial<Mission>>({})
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

  useEffect(() => {
    if (open && mission) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: mission.title,
        type: mission.type,
        goal: mission.goal,
        notes: mission.notes,
        estimation: mission.estimation,
        confidence: mission.confidence,
        project_id: mission.project_id,
        status: mission.status,
        estimated_delivery_date: mission.estimated_delivery_date,
        desired_delivery_date: mission.desired_delivery_date,
        priority: mission.priority,
      })
    }
  }, [open, mission])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic date validation
    if (formData.estimated_delivery_date) {
      const d = new Date(formData.estimated_delivery_date)
      if (isNaN(d.getTime())) {
        alert('Date de livraison estimée invalide (format attendu: YYYY-MM-DD)')
        return
      }
    }

    if (formData.desired_delivery_date) {
      const d = new Date(formData.desired_delivery_date)
      if (isNaN(d.getTime())) {
        alert('Date de livraison souhaitée invalide (format attendu: YYYY-MM-DD)')
        return
      }
    }

    // Map 'none' back to null if needed, but if using state it's already handled
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la mission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-project">Projet (Optionnel)</Label>
            <Select
              value={formData.project_id || 'none'}
              onValueChange={(value) => setFormData({ ...formData, project_id: value === 'none' ? null : value })}
            >
              <SelectTrigger id="edit-project">
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

          <div className="space-y-2">
            <Label>Priorité</Label>
            <PrioritySelect 
              value={(formData.priority as PriorityLevel) || 'medium'} 
              onValueChange={(value) => setFormData({ ...formData, priority: value })} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-title">Titre</Label>
            <Input
              id="edit-title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Type" />
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
              <Label htmlFor="edit-status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {MISSION_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-goal">Main Goal</Label>
            <Textarea
              id="edit-goal"
              value={formData.goal || ''}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="Objectif principal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes complémentaires"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-estimated-date">Date de Livraison Estimée</Label>
              <Input
                id="edit-estimated-date"
                value={formData.estimated_delivery_date || ''}
                onChange={(e) => setFormData({ ...formData, estimated_delivery_date: e.target.value })}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desired-date">Date de livraison souhaitée</Label>
              <Input
                id="edit-desired-date"
                value={formData.desired_delivery_date || ''}
                onChange={(e) => setFormData({ ...formData, desired_delivery_date: e.target.value })}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-estimation">Estimation (jours)</Label>
              <Input
                id="edit-estimation"
                type="number"
                step="0.5"
                value={formData.estimation || 0}
                onChange={(e) => setFormData({ ...formData, estimation: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-confidence">Confiance (%)</Label>
              <Input
                id="edit-confidence"
                type="number"
                min="0"
                max="100"
                value={formData.confidence || 0}
                onChange={(e) => setFormData({ ...formData, confidence: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            {onDelete && (
              <Button
                type="button"
                variant="outline"
                className="text-destructive hover:bg-destructive/10"
                onClick={onDelete}
                disabled={loading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            )}
            <div className="flex-1" />
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
