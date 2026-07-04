'use client'

import { useState, useMemo } from 'react'
import { Milestone, MissionMilestoneItem } from './mission-milestone-item'
import { Button } from '@/components/ui/button'
import { History, Plus } from 'lucide-react'

interface MissionMilestoneListProps {
  milestones: Milestone[]
  onAddClick?: () => void
  onEdit?: (milestone: Milestone) => void
  onDelete?: (milestone: Milestone) => void
  readonly?: boolean
}

export function MissionMilestoneList({ milestones, onAddClick, onEdit, onDelete, readonly }: MissionMilestoneListProps) {
  const [showAll, setShowAll] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { upcoming, past } = useMemo(() => {
    const sorted = [...milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return {
      upcoming: sorted.filter(m => new Date(m.date) >= today),
      past: sorted.filter(m => new Date(m.date) < today).reverse() // Most recent past first for full view
    }
  }, [milestones, today])

  const displayMilestones = useMemo(() => {
    if (showAll || readonly) {
      // Re-sort all by date for a chronological timeline when viewing all
      return [...milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }
    return upcoming
  }, [showAll, upcoming, milestones, readonly])

  const hasPast = past.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          JALONS
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.5 rounded">
            {milestones.length}
          </span>
        </h3>
        
        {!readonly && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAddClick}
            className="h-7 px-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Plus className="h-3 w-3 mr-1" /> AJOUTER
          </Button>
        )}
      </div>

      <div className="relative">
        {displayMilestones.length > 0 ? (
          <div className="pt-2">
            {displayMilestones.map((milestone) => (
              <MissionMilestoneItem 
                key={milestone.id} 
                milestone={milestone} 
                onEdit={() => onEdit?.(milestone)}
                onDelete={() => onDelete?.(milestone)}
                readonly={readonly}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg">
            <p className="text-xs text-slate-400">Aucun jalon prévu pour le moment.</p>
          </div>
        )}
      </div>

      {hasPast && !showAll && !readonly && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center gap-1.5 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 rounded-lg transition-all"
        >
          <History className="h-3.5 w-3.5" />
          VOIR LES JALONS PASSÉS ({past.length})
        </button>
      )}

      {showAll && !readonly && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center justify-center gap-1.5"
        >
          VOIR SEULEMENT LES JALONS À VENIR
        </button>
      )}
    </div>
  )
}
