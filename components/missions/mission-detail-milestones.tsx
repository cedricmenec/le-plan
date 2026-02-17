'use client'

import { useState } from 'react'
import { MissionMilestoneList } from './mission-milestone-list'
import { AddMilestoneDialog, EditMilestoneDialog } from './milestone-dialogs'
import { Milestone } from './mission-milestone-item'
import { deleteMilestone } from '@/app/missions/actions'
import { useToast } from '@/components/ui/use-toast'

interface MissionDetailMilestonesProps {
  missionId: string
  initialMilestones: Milestone[]
  readonly?: boolean
}

export function MissionDetailMilestones({ missionId, initialMilestones, readonly }: MissionDetailMilestonesProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const { toast } = useToast()
  
  const handleSuccess = async () => {
    window.location.reload()
  }

  const handleDelete = async (milestone: Milestone) => {
    try {
      await deleteMilestone(missionId, milestone.id)
      toast({
        title: "Jalon supprimé",
        description: "Le jalon a été supprimé avec succès.",
      })
      handleSuccess()
    } catch (error) {
      console.error('Failed to delete milestone', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le jalon.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <MissionMilestoneList 
        milestones={milestones} 
        onAddClick={() => setIsAddOpen(true)}
        onEdit={(m) => setEditingMilestone(m)}
        onDelete={handleDelete}
        readonly={readonly}
      />
      
      {!readonly && (
        <>
          <AddMilestoneDialog 
            missionId={missionId}
            open={isAddOpen}
            onOpenChange={setIsAddOpen}
            onSuccess={handleSuccess}
          />

          <EditMilestoneDialog
            missionId={missionId}
            milestone={editingMilestone}
            open={!!editingMilestone}
            onOpenChange={(open) => !open && setEditingMilestone(null)}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </>
  )
}
