'use client'

import { useMemo } from 'react'
import { calculateTimelineMetrics } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface MissionTimelineProps {
  estimation: number
  estimatedDelivery: string | null
  desiredDelivery: string | null
}

export function MissionTimeline({
  estimation,
  estimatedDelivery,
  desiredDelivery,
}: MissionTimelineProps) {
  const metrics = useMemo(() => {
    return calculateTimelineMetrics(new Date(), estimation, estimatedDelivery, desiredDelivery)
  }, [estimation, estimatedDelivery, desiredDelivery])

  if (!metrics) return null

  const { effortPercentage, estimatedPercentage, desiredPercentage, isDanger, delayDays } = metrics

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    return format(new Date(dateStr), 'yyyy-MM-dd')
  }

  return (
    <div className="w-full space-y-12">
      {/* Header & Legend */}
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Timeline & Scheduling</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20" />
            <span className="text-[11px] font-semibold text-slate-500 tracking-tight">Effort restant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-[11px] font-semibold text-slate-500 tracking-tight">Risk zone</span>
          </div>
        </div>
      </div>

      <div className="relative pt-8 pb-10 px-4">
        {/* Main Track */}
        <div className="relative h-[6px] w-full bg-slate-100 dark:bg-slate-800 rounded-full">
          
          {/* Risk Zone (Orange background between Target and Estimated if late) */}
          {isDanger && desiredPercentage !== null && estimatedPercentage !== null && (
            <div 
              className="absolute top-0 h-full bg-orange-200 dark:bg-orange-900/40 rounded-sm opacity-60"
              style={{ 
                left: `${desiredPercentage}%`, 
                width: `${estimatedPercentage - desiredPercentage}%` 
              }}
            />
          )}

          {/* Effort Segment (Blue) */}
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
            style={{ width: `${effortPercentage}%` }}
          />

          {/* Remaining Days Pill */}
          <div 
            className="absolute top-0 -translate-y-[calc(100%+12px)] flex justify-center"
            style={{ left: `${effortPercentage / 2}%` }}
          >
            <div className="bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider whitespace-nowrap">
              {estimation} {estimation > 1 ? 'days' : 'day'} remaining
            </div>
          </div>

          {/* Markers */}
          {/* Today Marker */}
          <div className="absolute top-0 left-0 flex flex-col items-center">
            <div className="absolute top-0 -translate-y-6 text-[10px] font-bold text-slate-400 tracking-tight">TODAY</div>
            <div className="h-8 w-[2px] bg-blue-500/30 -translate-y-[calc(50%-3px)]" />
          </div>

          {/* Target Marker */}
          {desiredPercentage !== null && (
            <div 
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${desiredPercentage}%` }}
            >
              <div className="absolute top-0 -translate-y-6 text-[10px] font-bold text-slate-400 tracking-tight uppercase">Target</div>
              <div className="h-10 w-[1px] bg-slate-300 dark:bg-slate-700 -translate-y-[calc(50%-3px)]" />
              <div className="absolute bottom-0 translate-y-8 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{formatDate(desiredDelivery)}</span>
                <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap">Livraison souhaitée</span>
              </div>
            </div>
          )}

          {/* Estimated Marker */}
          {estimatedPercentage !== null && (
            <div 
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${estimatedPercentage}%` }}
            >
              <div className={`absolute top-0 -translate-y-6 text-[10px] font-bold tracking-tight uppercase ${isDanger ? 'text-orange-500' : 'text-slate-400'}`}>
                Estimated
              </div>
              <div className={`h-10 w-[2px] -translate-y-[calc(50%-3px)] ${isDanger ? 'bg-orange-500' : 'bg-slate-400'}`} />
              <div className="absolute bottom-0 translate-y-8 flex flex-col items-center">
                <span className={`text-xs font-bold ${isDanger ? 'text-orange-600' : 'text-slate-700 dark:text-slate-300'}`}>
                  {formatDate(estimatedDelivery)}
                </span>
                {isDanger && (
                  <span className="text-[9px] font-bold text-orange-500 whitespace-nowrap">
                    Critical Delay (~{delayDays} days)
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
