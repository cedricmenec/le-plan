'use client'

import { useRouter } from 'next/navigation'
import { MissionWithProject } from './mission-card'
import { MissionActions } from './mission-actions'
import { PriorityBadge } from './priority-badge'
import { Badge } from '@/components/ui/badge'
import { romToDays, calculateTaskRemainingLoad, ROMSize } from '@/lib/load-utils'
import { 
  Shirt,
  ListTodo,
  LucideIcon
} from 'lucide-react'

const TYPE_COLORS: Record<string, string> = {
  feature: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
  study: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  support: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  docs: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400',
  other: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400',
}

interface CondensedMissionRowProps {
  mission: MissionWithProject
  showProjectName?: boolean
  onEdit: () => void
  onDelete: () => void
  isUpdating?: boolean
  isDeleting?: boolean
}

export function CondensedMissionRow({
  mission,
  showProjectName = false,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: CondensedMissionRowProps) {
  const router = useRouter()
  const colorClass = TYPE_COLORS[mission.type] || TYPE_COLORS.other
  const projectName = mission.projects?.name || mission.project_parent

  const romDays = romToDays(mission.rom_size as ROMSize)
  const tasksDays = calculateTaskRemainingLoad(mission.subtasks || [])
  
  const officialEstimationDisplay = mission.load_source === 'tasks' 
    ? `${tasksDays}j` 
    : `${romDays}j`
    
  const LoadIcon = mission.load_source === 'tasks' ? ListTodo : Shirt

  const handleRowClick = () => {
    router.push(`/missions/${mission.id}`)
  }

  return (
    <div 
      onClick={handleRowClick}
      className={`group grid grid-cols-[100px_1fr_120px_100px_48px] items-center px-4 py-3 bg-white dark:bg-[#15202b] hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors cursor-pointer ${
        (isDeleting || isUpdating) ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* Type Column */}
      <div className="flex justify-center">
        <Badge variant="secondary" className={`text-[10px] font-bold uppercase py-0 px-2 h-5 border-none ${colorClass}`}>
          {mission.type}
        </Badge>
      </div>

      {/* Mission Column */}
      <div className="flex flex-col min-w-0 px-2">
        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
          {mission.title}
        </div>
        {showProjectName && projectName && (
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {projectName}
          </div>
        )}
      </div>

      {/* Estimation Column */}
      <div className="flex justify-start items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 px-2">
        <span className="text-slate-400"><LoadIcon className="h-3.5 w-3.5" /></span>
        {officialEstimationDisplay}
      </div>

      {/* Priority Column */}
      <div className="flex justify-center">
        <PriorityBadge 
          priority={mission.priority || 'medium'} 
          variant="text"
          className="text-[9px]"
        />
      </div>

      {/* Actions Column */}
      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <MissionActions 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </div>
    </div>
  )
}
