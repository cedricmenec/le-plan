'use client'

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
import { Trash2 } from 'lucide-react'
import { SubtaskList } from './subtask-list'

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

interface Mission {
  id: string
  title: string
  type: string
  estimation: number
  confidence: number
  project_parent?: string
  status: string
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

  useEffect(() => {
    if (open && mission) {
      setFormData({
        title: mission.title,
        type: mission.type,
        estimation: mission.estimation,
        confidence: mission.confidence,
        project_parent: mission.project_parent || '',
        status: mission.status,
      })
    }
  }, [open, mission])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

          <div className="space-y-2">
            <Label htmlFor="edit-project">Projet Parent (Optionnel)</Label>
            <Input
              id="edit-project"
              value={formData.project_parent || ''}
              onChange={(e) => setFormData({ ...formData, project_parent: e.target.value })}
            />
          </div>

          <div className="border-t pt-4">
            <SubtaskList missionId={mission.id} />
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
