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
import { MissionLifecycle } from '@/components/missions/mission-lifecycle'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import type { MissionState } from '@/lib/types'

export default function MissionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [mission, setMission] = useState<any>(null)
  const [projects, setProjectsState] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadData = useCallback(async () => {
    if (!id) { setError(true); return }
    try {
      const [missionData, projectsData, milestonesData] = await Promise.all([
        getMission(id!),
        getProjects(),
        getMilestones(id!)
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
    if (!id) return
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
    navigate('/error', { replace: true })
    return null
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
          <div className="space-y-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Objectif Principal</h3>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </div>
              <InlineEditableField value={mission.goal} onSave={async (val) => { await handleUpdate({ goal: val }) }} displayClassName="text-xl leading-relaxed text-slate-700 dark:text-slate-300 min-h-[4rem]" placeholder="Décrire l'objectif principal de cette mission..." />
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
            <TaskList missionId={id!} readonly={isReadonly} />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-10">
          <MissionLifecycle mission={mission} />
          <MissionDetailMilestones missionId={id!} initialMilestones={milestones} readonly={isReadonly} />
          <StatusTimeline history={mission.status_history || []} />
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]">History</h3>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            </div>
            <MissionStatusHistoryList history={mission.status_history || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
