'use client'

import { useState } from 'react'
import { MissionMilestoneList } from './mission-milestone-list'
import { AddMilestoneDialog, EditMilestoneDialog } from './milestone-dialogs'
import { Milestone } from './mission-milestone-item'

interface MissionDetailMilestonesProps {
  missionId: string
  initialMilestones: Milestone[]
}

export function MissionDetailMilestones({ missionId, initialMilestones }: MissionDetailMilestonesProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [isAddOpen, setIsAddOpen] = useState(false)
  
  // Note: For now we don't need Edit in the list view based on the spec
  // but we keep the dialog ready.
  
  const handleSuccess = async () => {
    // In a real app with server actions and revalidatePath, 
    // the page would refresh. Here we can also manually refresh or rely on revalidation.
    // For immediate UI feedback if needed:
    // const updated = await getMilestones(missionId)
    // setMilestones(updated)
    
    // Simplest for now: 
    window.location.reload()
  }

  return (
    <>
      <MissionMilestoneList 
        milestones={milestones} 
        onAddClick={() => setIsAddOpen(true)}
      />
      
      <AddMilestoneDialog 
        missionId={missionId}
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}
