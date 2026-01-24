import { getMission, updateMission } from '../actions'
import { getProjects } from '../../projects/actions'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { TaskList } from '@/components/missions/task-list'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import { formatRelativeDuration } from '@/lib/utils'

import { 
  Smartphone, 
  BookOpen, 
  Wrench, 
  FileText, 
  MoreHorizontal,
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
  try {
    [mission, projects] = await Promise.all([
      getMission(id),
      getProjects()
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

  const missionTypes = [
    { label: 'Feature', value: 'feature', icon: Smartphone, color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20' },
    { label: 'Étude', value: 'study', icon: BookOpen, color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20' },
    { label: 'Support', value: 'support', icon: Wrench, color: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20' },
    { label: 'Docs', value: 'docs', icon: FileText, color: 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/20' },
    { label: 'Autre', value: 'other', icon: MoreHorizontal, color: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-900/20' },
  ]

  const missionStatuses = [
    { label: 'À faire', value: 'todo' },
    { label: 'En cours', value: 'in_progress' },
    { label: 'Terminé', value: 'done' },
  ]

  const projectOptions = projects.map(p => ({ label: p.name, value: p.id }))
  const currentType = missionTypes.find(t => t.value === mission.type) || missionTypes[4]
  const TypeIcon = currentType.icon

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${currentType.color}`}>
                <TypeIcon className="h-3.5 w-3.5" />
                <span>{currentType.label}</span>
              </div>
              <InlineEditableField
                value={mission.status}
                type="select"
                options={missionStatuses}
                onSave={async (val) => {
                  'use server'
                  await updateMission(id, { status: val })
                }}
                displayClassName="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              />
            </div>
            
            <InlineEditableField
              value={mission.title}
              onSave={async (val) => {
                'use server'
                await updateMission(id, { title: val })
              }}
              displayClassName="text-5xl font-extrabold tracking-tight h-auto py-1 text-slate-900 dark:text-white"
              className="text-5xl"
            />
            
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

        <div className="bg-white dark:bg-[#15202b] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-md h-fit sticky top-10">
          <TaskList missionId={mission.id} />
        </div>
      </div>
    </div>
  )
}
