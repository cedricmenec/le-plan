'use client'

import Link from 'next/link'
import { MissionWithProject } from './mission-card'
import { MissionActions } from './mission-actions'
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
  const Icon = TYPE_ICONS[mission.type] || TYPE_ICONS.other
  const colorClass = TYPE_COLORS[mission.type] || TYPE_COLORS.other
  const projectName = mission.projects?.name || mission.project_parent

  return (
    <div 
      className={`group flex items-center justify-between p-3 bg-white dark:bg-[#15202b] border border-slate-200 dark:border-slate-800 rounded-lg hover:border-primary/50 transition-colors ${
        (isDeleting || isUpdating) ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`h-8 w-8 rounded flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        
        <div className="flex flex-col min-w-0">
          <Link 
            href={`/missions/${mission.id}`}
            className="text-sm font-semibold text-slate-900 dark:text-white truncate hover:underline leading-none mb-1"
          >
            {mission.title}
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="capitalize">{mission.type}</span>
            {showProjectName && projectName && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="truncate">{projectName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <div className="text-[12px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
          {mission.estimation} j
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MissionActions 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </div>
      </div>
    </div>
  )
}
