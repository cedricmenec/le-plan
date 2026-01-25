'use client'

import { useMemo } from 'react'
import { calculateTimelineMetrics } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { AlertTriangle, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

  const { effortPercentage, estimatedPercentage, desiredPercentage, isDanger } = metrics

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'n/a'
    return format(new Date(dateStr), 'd MMM.', { locale: fr })
  }

  return (
    <div className="w-full space-y-6 py-4">
      <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-visible">
        {/* Effort Segment */}
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-l-full transition-all duration-500"
          style={{ width: `${effortPercentage}%` }}
        />

        {/* Today Marker */}
        <div className="absolute top-0 left-0 -translate-x-1/2 flex flex-col items-center">
          <div className="h-4 w-0.5 bg-slate-400 dark:bg-slate-600 mb-1" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Aujourd'hui</span>
        </div>

        {/* Estimated Marker */}
        {estimatedPercentage !== null && (
          <div 
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10"
            style={{ left: `${estimatedPercentage}%` }}
          >
            <div className={`h-4 w-1 mb-1 rounded-full ${isDanger ? 'bg-rose-500' : 'bg-blue-600'}`} />
            <div className="flex flex-col items-center bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800 shadow-sm">
              <span className={`text-[10px] font-bold whitespace-nowrap ${isDanger ? 'text-rose-600' : 'text-blue-600'}`}>
                {formatDate(estimatedDelivery)}
              </span>
              <span className="text-[8px] font-medium text-slate-400 uppercase leading-none">Est.</span>
            </div>
          </div>
        )}

        {/* Desired Marker */}
        {desiredPercentage !== null && (
          <div 
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${desiredPercentage}%` }}
          >
            <div className="h-4 w-0.5 bg-slate-300 dark:bg-slate-700 mb-1" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                {formatDate(desiredDelivery)}
              </span>
              <span className="text-[8px] font-medium text-slate-400 uppercase leading-none">Voulu</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-blue-500 rounded-sm" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {estimation} jours d'effort restant
          </span>
        </div>

        {isDanger && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-full border border-rose-100 dark:border-rose-900/30">
            <AlertTriangle data-testid="timeline-danger-icon" className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Planning en danger</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1 text-rose-400 hover:text-rose-600 transition-colors">
                  <Info className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">La date de livraison estimée dépasse la date souhaitée.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}
