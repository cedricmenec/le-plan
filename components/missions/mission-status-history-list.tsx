'use client'

import { MissionState, MissionReason } from '@prisma/client'
import { StatusHistoryEntry } from '@/lib/missions/duration-utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { StateBadge } from './state-badge'
import { Clock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface MissionStatusHistoryListProps {
  history: StatusHistoryEntry[]
}

export function MissionStatusHistoryList({ history }: MissionStatusHistoryListProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!history || history.length === 0) return null

  // Show newest first
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-muted-foreground hover:text-slate-900 dark:hover:text-slate-200 transition-colors w-full group"
      >
        <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Historique des Statuts</h3>
        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isExpanded && (
        <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent animate-in fade-in slide-in-from-top-2 duration-300">
          {sortedHistory.map((entry, i) => (
            <div key={i} className="relative flex items-start gap-6 group">
              <div className="absolute left-0 mt-1.5 flex h-10 w-10 items-center justify-center rounded-full border border-white dark:border-slate-950 bg-slate-50 dark:bg-slate-900 shadow-sm z-10 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                <Clock className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>

              <div className="flex-1 ml-12 pt-1.5 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <StateBadge state={entry.status} reason={entry.reason} />
                  </div>
                  <time className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {format(new Date(entry.created_at), 'PPPp', { locale: fr })}
                  </time>
                </div>
                
                {(entry as any).note && (
                  <div className="mt-2 flex items-start gap-2 p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 italic">
                    <MessageSquare className="h-4 w-4 mt-0.5 text-slate-300 shrink-0" />
                    <p>{(entry as any).note}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
