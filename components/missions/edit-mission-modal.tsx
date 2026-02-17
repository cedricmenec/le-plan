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
import { MissionState, MissionReason } from '@prisma/client'
import { MissionStateMachine } from '@/lib/missions/state-machine'
import { createClient } from '@/lib/supabase/client'
import { PrioritySelect } from './priority-select'
import { PriorityLevel } from './priority-badge'

type Project = { id: string; name: string; status: string }
type Mission = {
  id: string
  title: string
  type: string
  status: string
  state: MissionState
  reason: MissionReason | null
  confidence: number | null
  goal: string | null
  notes: string | null
  project_id: string | null
  rom_size: string | null
  load_source: string
  estimated_delivery_date: string | null
  desired_delivery_date: string | null
  priority: string | null
  estimation: number | null
}

const MISSION_TYPES = [
  { value: 'feature', label: 'Feature' },
  { value: 'study', label: 'Étude' },
  { value: 'support', label: 'Support' },
  { value: 'docs', label: 'Documentation' },
  { value: 'other', label: 'Autre' },
]

const STATE_LABELS: Record<string, string> = {
  [MissionState.Backlog]: 'Backlog',
  [MissionState.Queued]: 'Next Up',
  [MissionState.Active]: 'En cours',
  [MissionState.Suspended]: 'Suspendu',
  [MissionState.Terminated]: 'Terminé / Clos',
}

const REASON_LABELS: Record<string, string> = {
  [MissionReason.Blocked]: 'Bloqué',
  [MissionReason.Deprioritized]: 'Dépriorisé',
  [MissionReason.Done]: 'Fait (Done)',
  [MissionReason.Cancelled]: 'Annulé',
}

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
        .select('id, name, status')
        .eq('status', 'active')
        .order('name')
      
      setProjects(data || [])
    }
    if (open) fetchProjects()
  }, [supabase, open])

  useEffect(() => {
    if (open && mission) {
      setFormData({
        title: mission.title,
        type: mission.type,
        goal: mission.goal,
        notes: mission.notes,
        estimation: mission.estimation,
        confidence: mission.confidence,
        project_id: mission.project_id,
        state: mission.state,
        reason: mission.reason,
        estimated_delivery_date: mission.estimated_delivery_date,
        desired_delivery_date: mission.desired_delivery_date,
        priority: mission.priority,
      })
    }
  }, [open, mission])

  const nextStates = mission ? [mission.state, ...MissionStateMachine.getValidNextStates(mission.state)] : []
  const availableReasons = formData.state ? MissionStateMachine.getValidReasons(formData.state) : []

  const handleStateChange = (nextState: MissionState) => {
    const reasons = MissionStateMachine.getValidReasons(nextState)
    setFormData({ 
      ...formData, 
      state: nextState, 
      reason: reasons.length > 0 ? reasons[0] : null 
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.state && !MissionStateMachine.validateStateAndReason(formData.state, formData.reason || null)) {
      alert(`Un motif est requis pour l'état ${formData.state}`)
      return
    }

    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la mission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="edit-state">État</Label>
              <Select
                value={formData.state}
                onValueChange={(value) => handleStateChange(value as MissionState)}
              >
                <SelectTrigger id="edit-state">
                  <SelectValue placeholder="État" />
                </SelectTrigger>
                <SelectContent>
                  {nextStates.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {availableReasons.length > 0 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <Label htmlFor="edit-reason">Motif / Raison</Label>
              <Select
                value={formData.reason || ''}
                onValueChange={(value) => setFormData({ ...formData, reason: value as MissionReason })}
              >
                <SelectTrigger id="edit-reason">
                  <SelectValue placeholder="Sélectionner une raison" />
                </SelectTrigger>
                <SelectContent>
                  {availableReasons.map((r) => (
                    <SelectItem key={r} value={r}>
                      {REASON_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-goal">Objectif Principal</Label>
            <Textarea
              id="edit-goal"
              value={formData.goal || ''}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="Quel est l'objectif de cette mission ?"
              className="h-20"
            />
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
                className="text-destructive hover:bg-destructive/10 border-destructive/20"
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
