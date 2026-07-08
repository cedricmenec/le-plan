'use client';

import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMission, updateMission, getMilestones } from '@/app/missions/actions'
import { getProjects } from '@/app/projects/actions'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { TaskList } from '@/components/missions/task-list'
import { MissionDetailMilestones } from '@/components/missions/mission-detail-milestones'
import { StatusTimeline } from '@/components/missions/status-timeline'
import { MissionStatusHistoryList } from '@/components/missions/mission-status-history-list'
import { MissionHeaderHero, MissionHeroBlock } from '@/components/missions/mission-header-hero'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import type { MissionState } from '@/lib/types'
import { MissionLifecycle } from './mission-lifecycle'

export function MissionDetailContent() {
  const params = useParams()
  const id = params.id as string
  const [mission, setMission] = useState<any>(null)
  const [projects, setProjectsState] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [missionData, projectsData, milestonesData] = await Promise.all([
        getMission(id),
        getProjects(),
        getMilestones(id)
      ])
      if (!missionData) { setError(true); return }
      setMission(missionData)
      setProjectsState(projectsData || [])
      setMilestones(milestonesData || [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUpdate = useCallback(async (updates: any) => {
    await updateMission(id, updates)
    loadData()
  }, [id, loadData])

  if (loading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    )
  }

  if (error || !mission) {
    return null // fallback handled by React Router error route
  }

  const isReadonly = mission.state === 'Terminated' as MissionState

  const breadcrumbItems = mission.projects
    ? [
        { label: 'Projects', href: '/projects' },
        { label: mission.projects.name, href: `/projects/${mission.project_id}` },
        { label: mission.title }
      ]
    : [
        { label: 'Missions', href: '/' },
        { label: mission.title }
      ]

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <MissionHeaderHero mission={mission} onUpdate={handleUpdate} readonly={isReadonly} />
          <MissionLifecycle mission={mission} />
          <div className="space-y-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Objectif Principal</h3>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </div>
              <InlineEditableField value={mission.goal} onSave={async (val) => { await handleUpdate({ goal: val }) }} type="textarea" displayClassName="text-xl leading-relaxed text-slate-700 dark:text-slate-300 min-h-[4rem]" placeholder="Décrire l'objectif principal de cette mission..." />
            </div>
            <MissionHeroBlock mission={mission} onUpdate={handleUpdate} readonly={isReadonly} />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Notes & Contexte</h3>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="p-6 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <InlineEditableField value={mission.notes} onSave={async (val) => { await handleUpdate({ notes: val }) }} type="textarea" displayClassName="text-base text-slate-600 dark:text-slate-400 whitespace-pre-wrap min-h-[6rem] leading-relaxed" placeholder="Ajouter des notes complémentaires, liens ou détails techniques..." />
              </div>
            </div>
            {mission.status_history && mission.status_history.length > 0 && (
              <div className="p-8 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-10">
                <StatusTimeline history={mission.status_history} />
                <div className="h-px bg-slate-200 dark:bg-slate-800" />
                <MissionStatusHistoryList history={mission.status_history} />
              </div>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-[#15202b] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 h-fit sticky top-10 space-y-10">
          <MissionDetailMilestones missionId={mission.id} initialMilestones={milestones} readonly={isReadonly} />
          <div className="h-px bg-slate-100 dark:bg-slate-800" />
          <TaskList missionId={mission.id} readonly={isReadonly} />
        </div>
      </div>
    </div>
  )
}
