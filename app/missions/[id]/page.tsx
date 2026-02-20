import { getMission, updateMission, getMilestones } from '../actions'
import { getProjects } from '../../projects/actions'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { TaskList } from '@/components/missions/task-list'
import { MissionDetailMilestones } from '@/components/missions/mission-detail-milestones'
import { StatusTimeline } from '@/components/missions/status-timeline'
import { MissionStatusHistoryList } from '@/components/missions/mission-status-history-list'
import { MissionHeaderHero, MissionHeroBlock } from '@/components/missions/mission-header-hero'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import { formatRelativeDuration } from '@/lib/utils'
import { MissionState } from '@prisma/client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MissionDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  let mission;
  let projects;
  let milestones;
  try {
    [mission, projects, milestones] = await Promise.all([
      getMission(id),
      getProjects(),
      getMilestones(id)
    ])
  } catch (error) {
    console.error('Error fetching data:', error)
    return notFound()
  }

  if (!mission) {
    return notFound()
  }

  const isReadonly = mission.state === MissionState.Terminated

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

  const projectOptions = projects.map(p => ({ label: p.name, value: p.id }))

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <MissionHeaderHero 
            mission={mission} 
            onUpdate={async (updates) => {
              'use server'
              await updateMission(id, updates)
            }} 
            readonly={isReadonly}
          />

          <div className="space-y-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Objectif Principal</h3>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </div>
              <InlineEditableField
                value={mission.goal}
                onSave={async (val) => {
                  'use server'
                  await updateMission(id, { goal: val })
                }}
                trigger={isReadonly ? "none" : "doubleClick"}
                type="textarea"
                displayClassName="text-xl leading-relaxed text-slate-700 dark:text-slate-300 min-h-[4rem]"
                placeholder="Décrire l'objectif principal de cette mission..."
              />
            </div>

            <MissionHeroBlock 
              mission={mission} 
              onUpdate={async (updates) => {
                'use server'
                await updateMission(id, updates)
              }}
              readonly={isReadonly}
            />

            {mission.status_history && mission.status_history.length > 0 && (
              <div className="p-8 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-10">
                <StatusTimeline history={mission.status_history} />
                <div className="h-px bg-slate-200 dark:bg-slate-800" />
                <MissionStatusHistoryList history={mission.status_history} />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Notes & Contexte</h3>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="p-6 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <InlineEditableField
                  value={mission.notes}
                  onSave={async (val) => {
                    'use server'
                    await updateMission(id, { notes: val })
                  }}
                  trigger={isReadonly ? "none" : "doubleClick"}
                  type="textarea"
                  displayClassName="text-base text-slate-600 dark:text-slate-400 whitespace-pre-wrap min-h-[6rem] leading-relaxed"
                  placeholder="Ajouter des notes complémentaires, liens ou détails techniques..."
                />
              </div>
            </div>
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
