'use client'

import * as React from 'react'
import { Database } from '@/types/database.types'
import { calculateTotalLoad, calculateMissionDuration } from '@/lib/load-utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getRecentlyCompletedMissions } from '@/app/projects/actions'
import { Loader2, History } from 'lucide-react'

type MissionWithTasks = Database['public']['Tables']['missions']['Row'] & {
  subtasks: Database['public']['Tables']['subtasks']['Row'][]
}

interface RecentlyCompletedMissionsProps {
  projectId: string
  initialMissions: MissionWithTasks[]
}

export function RecentlyCompletedMissions({
  projectId,
  initialMissions,
}: RecentlyCompletedMissionsProps) {
  const [missions, setMissions] = React.useState<MissionWithTasks[]>(initialMissions)
  const [days, setDays] = React.useState('all')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleDaysChange = async (value: string) => {
    // Currently disabled, but logic kept for future restoration
    setDays(value)
    setIsLoading(true)
    try {
      const d = value === 'all' ? -1 : parseInt(value)
      const data = await getRecentlyCompletedMissions(projectId, d)
      setMissions(data as MissionWithTasks[])
    } catch (error) {
      console.error('Failed to fetch completed missions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 mt-12 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Missions Récemment Terminées
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Voir les:</span>
          <Select value={days} onValueChange={handleDaysChange} disabled>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 jours</SelectItem>
              <SelectItem value="15">15 jours</SelectItem>
              <SelectItem value="30">1 mois</SelectItem>
              <SelectItem value="all">∞</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#15202b]">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}

        {/* Table Header */}
        <div className="grid grid-cols-[100px_1fr_120px_120px] items-center px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="text-center">Type</div>
          <div>Mission</div>
          <div className="text-left px-2">Charge réel</div>
          <div className="text-center">Durée</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {missions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground italic">Aucune mission terminée récemment.</p>
            </div>
          ) : (
            missions.map((mission) => {
              const actualLoad = calculateTotalLoad(mission.subtasks)
              const duration = calculateMissionDuration(mission.started_at, mission.completed_at)
              
              return (
                <div 
                  key={mission.id} 
                  className="grid grid-cols-[100px_1fr_120px_120px] items-center px-4 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
                >
                  <div className="text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {mission.type}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {mission.title}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 px-2 font-mono">
                    {actualLoad}j
                  </div>
                  <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    {duration}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
