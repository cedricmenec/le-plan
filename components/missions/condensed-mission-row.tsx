'use client'

import { useRouter } from 'next/navigation'
import { MissionWithProject } from './mission-card'
import { MissionActions } from './mission-actions'
import { Badge } from '@/components/ui/badge'
import { 
  Smartphone, 
  BookOpen, 
  Wrench, 
  FileText, 
  MoreHorizontal,
  LucideIcon
} from 'lucide-react'

const TYPE_ICONS: Record<string, LucideIcon> = {
  feature: Smartphone,
  study: BookOpen,
  support: Wrench,
  docs: FileText,
  other: MoreHorizontal,
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
  const Icon = TYPE_ICONS[mission.type] || TYPE_ICONS.other
  const projectName = mission.projects?.name || mission.project_parent

  const handleRowClick = () => {
    router.push(`/missions/${mission.id}`)
  }

  return (
    <div 
      onClick={handleRowClick}
      className={`group grid grid-cols-[1fr,100px,120px,100px,48px] items-center px-4 py-3 bg-white dark:bg-[#15202b] hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors cursor-pointer ${
        (isDeleting || isUpdating) ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* Mission Column */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 flex-shrink-0" />
        <div className="flex flex-col min-w-0">
          <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {mission.title}
          </div>
          {showProjectName && projectName && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {projectName}
            </div>
          )}
        </div>
      </div>

      {/* Type Column */}
      <div className="flex justify-center">
        <Badge variant="secondary" className="text-[10px] font-bold uppercase py-0 px-2 h-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none">
          {mission.type}
        </Badge>
      </div>

      {/* Estimation Column */}
      <div className="flex justify-center items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
        <span className="text-slate-400"><Icon className="h-3.5 w-3.5" /></span>
        {mission.estimation} jours
      </div>

      {/* Priority Column (Placeholder) */}
      <div className="text-center text-[11px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-wider">
        n/a
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
