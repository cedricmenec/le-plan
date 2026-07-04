import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MilestoneForm } from './milestone-form'
import { createMilestone, updateMilestone } from '@/app/missions/actions'
import { useToast } from '@/components/ui/use-toast'
import { Milestone } from './mission-milestone-item'

interface AddMilestoneDialogProps {
  missionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddMilestoneDialog({ missionId, open, onOpenChange, onSuccess }: AddMilestoneDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    setLoading(true)
    try {
      await createMilestone(missionId, data)
      toast({
        title: "Jalon créé",
        description: "Le jalon a été ajouté avec succès.",
      })
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Failed to create milestone', error)
      toast({
        title: "Erreur",
        description: "Impossible de créer le jalon.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un jalon</DialogTitle>
        </DialogHeader>
        <MilestoneForm 
          missionId={missionId} 
          onSubmit={handleSubmit} 
          loading={loading} 
          buttonText="Ajouter le jalon"
        />
      </DialogContent>
    </Dialog>
  )
}

interface EditMilestoneDialogProps {
  milestone: Milestone | null
  missionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditMilestoneDialog({ milestone, missionId, open, onOpenChange, onSuccess }: EditMilestoneDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  if (!milestone) return null

  const handleSubmit = async (data: any) => {
    setLoading(true)
    try {
      await updateMilestone(missionId, milestone.id, data)
      toast({
        title: "Jalon mis à jour",
        description: "Le jalon a été modifié avec succès.",
      })
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Failed to update milestone', error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le jalon.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le jalon</DialogTitle>
        </DialogHeader>
        <MilestoneForm 
          missionId={missionId} 
          initialData={milestone}
          onSubmit={handleSubmit} 
          loading={loading} 
          buttonText="Enregistrer les modifications"
        />
      </DialogContent>
    </Dialog>
  )
}