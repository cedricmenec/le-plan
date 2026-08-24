import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Flag,
  Users,
  Presentation,
  Package,
  FileText,
  CircleEllipsis,
  MoreHorizontal,
  Calendar,
  StickyNote
} from 'lucide-react'
import { Database } from '@/types/database.types'
import { useState, useRef, useEffect } from 'react'
import { MilestoneActions } from './milestone-actions'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type Milestone = Database['public']['Tables']['milestones']['Row'] & {
  milestone_types: { name: string } | null
}

interface MissionMilestoneItemProps {
  milestone: Milestone
  onEdit?: () => void
  onDelete?: () => void
  readonly?: boolean
}

const TYPE_ICONS: Record<string, any> = {
  'Cadrage / Kick-off': Flag,
  'Réunion / Review': Users,
  'Meeting / Workshop': Presentation,
  'Livraison intermédiaire': Package,
  'Documentation': FileText,
  'Autre': CircleEllipsis,
}

export function MissionMilestoneItem({ milestone, onEdit, onDelete, readonly }: MissionMilestoneItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const milestoneDate = new Date(milestone.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const isPast = milestoneDate < today
  const typeName = milestone.milestone_types?.name || 'Autre'
  const Icon = TYPE_ICONS[typeName] || MoreHorizontal

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) return
    hoverTimeoutRef.current = setTimeout(() => {
      setShowActions(true)
    }, 1000)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    if (!isMenuOpen) {
      setShowActions(false)
    }
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      className={`group relative pl-8 pb-6 border-l-2 last:pb-0 ${
        isPast 
          ? 'border-slate-200 dark:border-slate-800' 
          : 'border-blue-200 dark:border-blue-900'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon Bubble */}
      <div 
        className={`absolute left-[-13px] top-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          isPast 
            ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400' 
            : 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
        }`}
      >
        <Icon className="h-3 w-3" />
      </div>

      <div className={`${isPast ? 'opacity-60' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isPast ? 'text-slate-400' : 'text-blue-600 dark:text-blue-400'
            }`}>
              {typeName}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(milestoneDate, 'PPP', { locale: fr })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 h-8">
            {!readonly && (
              <div 
                className={`transition-all duration-200 ${
                  (showActions || isMenuOpen) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <MilestoneActions 
                  onEdit={onEdit || (() => {})} 
                  onDelete={onDelete || (() => {})} 
                  onOpenChange={setIsMenuOpen}
                />
              </div>
            )}
            
            {milestone.note && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    aria-label="Voir la note"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    <StickyNote className="h-3.5 w-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" className="w-64 text-xs whitespace-pre-wrap">
                  {milestone.note}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <h5 className={`mt-1 text-sm font-bold ${
          isPast ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'
        }`}>
          {milestone.title}
        </h5>
      </div>
    </div>
  )
}