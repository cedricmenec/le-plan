'use client'

import { useMemo } from 'react'
import { MissionState, MissionReason } from '@prisma/client'
import { StatusHistoryEntry } from '@/lib/missions/duration-utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"

interface StatusTimelineProps {
  history: StatusHistoryEntry[]
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  const segments = useMemo(() => {
    if (!history || history.length === 0) return []

    const sorted = [...history].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    // Only consider from first Active state to Terminated (or now if not terminated)
    const firstActiveIndex = sorted.findIndex(h => h.status === MissionState.Active)
    if (firstActiveIndex === -1) return []

    const relevantHistory = sorted.slice(firstActiveIndex)
    const terminatedIndex = relevantHistory.findIndex(h => h.status === MissionState.Terminated)
    
    const endDate = terminatedIndex !== -1 
      ? new Date(relevantHistory[terminatedIndex].created_at) 
      : new Date()

    const timelineHistory = terminatedIndex !== -1 
      ? relevantHistory.slice(0, terminatedIndex + 1)
      : relevantHistory

    const totalDuration = endDate.getTime() - new Date(timelineHistory[0].created_at).getTime()
    if (totalDuration <= 0) return []

    const result = []
    for (let i = 0; i < timelineHistory.length; i++) {
      const current = timelineHistory[i]
      if (current.status === MissionState.Terminated) continue

      const next = timelineHistory[i + 1]
      const start = new Date(current.created_at)
      const end = next ? new Date(next.created_at) : endDate
      const duration = end.getTime() - start.getTime()
      const percentage = (duration / totalDuration) * 100

      if (percentage <= 0) continue

      result.push({
        status: current.status,
        reason: current.reason,
        percentage,
        durationMs: duration,
        start,
        end
      })
    }

    return result
  }, [history])

  if (segments.length === 0) return null

  const getStatusColor = (status: MissionState, reason?: MissionReason | null) => {
    if (status === MissionState.Active) return 'bg-slate-900 dark:bg-slate-100'
    if (status === MissionState.Suspended) {
      return reason === MissionReason.Blocked ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'
    }
    return 'bg-slate-100 dark:bg-slate-800'
  }

  const getStatusLabel = (status: MissionState, reason?: MissionReason | null) => {
    if (status === MissionState.Active) return 'Actif'
    if (status === MissionState.Suspended) {
      return reason === MissionReason.Blocked ? 'Bloqué' : 'En pause'
    }
    return status
  }

  const formatDuration = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days}j`
    const hours = Math.floor(ms / (1000 * 60 * 60))
    if (hours > 0) return `${hours}h`
    const minutes = Math.floor(ms / (1000 * 60))
    return `${minutes}m`
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Audit du Cycle de Vie</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-900 dark:bg-slate-100" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Actif</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">En pause</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Bloqué</span>
          </div>
        </div>
      </div>

      <TooltipProvider>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
          {segments.map((segment, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div 
                  className={`status-segment h-full transition-all hover:opacity-80 cursor-help ${getStatusColor(segment.status, segment.reason)}`}
                  style={{ width: `${segment.percentage}%` }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <p className="font-bold">{getStatusLabel(segment.status, segment.reason)}</p>
                  <p className="text-slate-400">{formatDuration(segment.durationMs)}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}
