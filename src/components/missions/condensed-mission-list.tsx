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
      <div className="text-center py-10 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-900/10">
        <p className="text-sm text-muted-foreground italic">Aucune mission à venir pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#15202b]">
      {/* Header */}
      <div className="grid grid-cols-[100px_1fr_120px_100px_48px] items-center px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="text-center">Type</div>
        <div>Mission</div>
        <div className="text-left px-2">Charge Estimée</div>
        <div className="text-center">Priorité</div>
        <div></div>
      </div>
      
      {/* List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
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
    </div>
  )
}