'use client'

import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { MissionActions } from './mission-actions'
import { Database } from '@/types/database.types'
import { formatRelativeDuration } from '@/lib/utils'
import { romToDays, calculateTaskRemainingLoad, ROMSize } from '@/lib/load-utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Smartphone, 
  BookOpen, 
  Wrench, 
  FileText, 
  MoreHorizontal, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  StickyNote,
  Shirt,
  ListTodo,
  LucideIcon
} from 'lucide-react'

export type Mission = Database['public']['Tables']['missions']['Row']
export type Subtask = Database['public']['Tables']['subtasks']['Row']
export type MissionWithProject = Mission & { 
  projects: { name: string } | null,
  subtasks?: Subtask[]
}

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

interface MissionCardProps {
  mission: MissionWithProject
  onEdit: () => void
  onDelete: () => void
  isUpdating?: boolean
  isDeleting?: boolean
}

export function MissionCard({ 
  mission, 
  onEdit, 
  onDelete, 
  isUpdating, 
  isDeleting 
}: MissionCardProps) {
  const [isTruncated, setIsTruncated] = useState(false)
  const goalRef = useRef<HTMLParagraphElement>(null)
  
  const Icon = TYPE_ICONS[mission.type] || TYPE_ICONS.other
  const colorClass = TYPE_COLORS[mission.type] || TYPE_COLORS.other
  const confidence = mission.confidence || 0
  const isHighConfidence = confidence >= 80
  const projectName = mission.projects?.name || mission.project_parent
  
  const statusLabels: Record<string, string> = {
    todo: 'TODO',
    in_progress: 'ACTIVE',
    done: 'DONE'
  }
  const statusDisplay = statusLabels[mission.status] || mission.status.toUpperCase()

  const romDays = romToDays(mission.rom_size as ROMSize)
  const tasksDays = calculateTaskRemainingLoad(mission.subtasks || [])
  
  const officialEstimationDisplay = mission.load_source === 'tasks' 
    ? `${tasksDays}j` 
    : `${romDays}j`
    
  const LoadIcon = mission.load_source === 'tasks' ? ListTodo : Shirt

  useEffect(() => {
    const checkTruncation = () => {
      if (goalRef.current) {
        setIsTruncated(goalRef.current.scrollHeight > goalRef.current.clientHeight)
      }
    }

    checkTruncation()
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [mission.goal])

  const goalContent = (
    <p 
      ref={goalRef}
      className={`mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 transition-colors duration-200 ${
        isTruncated ? 'hover:text-slate-700 dark:hover:text-slate-200 cursor-help' : ''
      }`}
    >
      {mission.goal}
    </p>
  )

  return (
    <div 
      className={`group bg-white dark:bg-[#15202b] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${
        (isDeleting || isUpdating) ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            
            <div className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider">
              {statusDisplay}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {mission.notes && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button data-testid="notes-icon" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <StickyNote className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs break-words">
                  <p className="text-xs whitespace-pre-wrap">{mission.notes}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${
              isHighConfidence 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-300'
            }`}>
              {isHighConfidence ? <ShieldCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              <span className="text-[11px] font-bold">{confidence}%</span>
            </div>
            
            <MissionActions 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            {mission.type} {projectName && `• ${projectName}`}
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
            {mission.title}
          </h4>
          {mission.goal && (
            isTruncated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  {goalContent}
                </TooltipTrigger>
                <TooltipContent className="max-w-xs break-words">
                  <p className="text-xs">{mission.goal}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              goalContent
            )
          )}
        </div>
      </div>

      <div className="space-y-2 mt-auto">
        <div className="pt-3 flex justify-between items-center text-[11px] border-t border-slate-50 dark:border-slate-800/50 mt-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold tracking-wider">STATUT: {mission.status.toUpperCase()}</span>
            {mission.estimated_delivery_date && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {formatRelativeDuration(mission.estimated_delivery_date)}
                </span>
              </>
            )}
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-1">
              <LoadIcon className="h-3 w-3" />
              <span>{officialEstimationDisplay}</span>
            </div>
          </div>
          <Link 
            href={`/missions/${mission.id}`}
            className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 hover:underline tracking-wider"
          >
            DETAILS <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
