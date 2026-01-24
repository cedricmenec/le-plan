'use client'

import { MissionWithProject } from './mission-card'
import { CondensedMissionRow } from './condensed-mission-row'

interface CondensedMissionListProps {
  missions: MissionWithProject[]
  showProjectName?: boolean
  onEdit: (mission: MissionWithProject) => void
  onDelete: (mission: MissionWithProject) => void
  updatingId?: string | null
  deletingId?: string | null
}

export function CondensedMissionList({
  missions,
  showProjectName = false,
  onEdit,
  onDelete,
  updatingId,
  deletingId,
}: CondensedMissionListProps) {
  if (missions.length === 0) {
    return (
      <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
        <p className="text-sm text-muted-foreground italic">Aucune mission à venir.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {missions.map((mission) => (
        <CondensedMissionRow
          key={mission.id}
          mission={mission}
          showProjectName={showProjectName}
          onEdit={() => onEdit(mission)}
          onDelete={() => onDelete(mission)}
          isUpdating={updatingId === mission.id}
          isDeleting={deletingId === mission.id}
        />
      ))}
    </div>
  )
}
