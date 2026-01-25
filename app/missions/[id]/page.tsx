import { getMission, updateMission, getMilestones } from '../actions'
import { getProjects } from '../../projects/actions'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { TaskList } from '@/components/missions/task-list'
import { MissionDetailMilestones } from '@/components/missions/mission-detail-milestones'
import { MissionHeaderHero } from '@/components/missions/mission-header-hero'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import { formatRelativeDuration } from '@/lib/utils'

import { 
  Calendar,
  ShieldCheck,
  Briefcase
} from 'lucide-react'

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
                type="textarea"
                displayClassName="text-xl leading-relaxed text-slate-700 dark:text-slate-300 min-h-[4rem]"
                placeholder="Décrire l'objectif principal de cette mission..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Notes & Contexte</h3>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="p-6 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <InlineEditableField
                  value={mission.notes}
                  onSave={async (val) => {
                    'use server'
                    await updateMission(id, { notes: val })
                  }}
                  type="textarea"
                  displayClassName="text-base text-slate-600 dark:text-slate-400 whitespace-pre-wrap min-h-[6rem] leading-relaxed"
                  placeholder="Ajouter des notes complémentaires, liens ou détails techniques..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Estimation</p>
              </div>
              <div className="flex items-baseline gap-1">
                <InlineEditableField
                  value={mission.estimation}
                  type="number"
                  onSave={async (val) => {
                    'use server'
                    await updateMission(id, { estimation: val })
                  }}
                  displayClassName="text-2xl font-bold text-slate-900 dark:text-white"
                  placeholder="0"
                />
                <span className="text-sm font-medium text-muted-foreground">jours</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Confiance</p>
              </div>
              <div className="flex items-baseline gap-1">
                <InlineEditableField
                  value={mission.confidence}
                  type="number"
                  onSave={async (val) => {
                    'use server'
                    await updateMission(id, { confidence: val })
                  }}
                  displayClassName="text-2xl font-bold text-slate-900 dark:text-white"
                  placeholder="0"
                />
                <span className="text-sm font-medium text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Livraison Estimée</p>
              </div>
              <div className="flex flex-col">
                <InlineEditableField
                  value={mission.estimated_delivery_date}
                  onSave={async (val) => {
                    'use server'
                    await updateMission(id, { estimated_delivery_date: val || null })
                  }}
                  displayClassName="text-lg font-bold text-slate-900 dark:text-white"
                  placeholder="n/a"
                />
                {mission.estimated_delivery_date && (
                  <span className="text-[10px] font-medium text-muted-foreground italic">
                    ({formatRelativeDuration(mission.estimated_delivery_date)})
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Livraison Souhaitée</p>
              </div>
              <div className="flex flex-col">
                <InlineEditableField
                  value={mission.desired_delivery_date}
                  onSave={async (val) => {
                    'use server'
                    await updateMission(id, { desired_delivery_date: val || null })
                  }}
                  displayClassName="text-lg font-bold text-slate-900 dark:text-white"
                  placeholder="n/a"
                />
                {mission.desired_delivery_date && (
                  <span className="text-[10px] font-medium text-muted-foreground italic">
                    ({formatRelativeDuration(mission.desired_delivery_date)})
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Briefcase className="h-4 w-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Projet</p>
              </div>
              <InlineEditableField
                value={mission.project_id}
                type="select"
                options={projectOptions}
                onSave={async (val) => {
                  'use server'
                  await updateMission(id, { project_id: val === 'none' ? null : val })
                }}
                displayClassName="text-lg font-semibold text-primary hover:underline underline-offset-4"
                placeholder="Assigner un projet..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#15202b] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-md h-fit sticky top-10 space-y-10">
          <MissionDetailMilestones missionId={mission.id} initialMilestones={milestones} />
          <div className="h-px bg-slate-100 dark:bg-slate-800" />
          <TaskList missionId={mission.id} />
        </div>
      </div>
    </div>
  )
}
