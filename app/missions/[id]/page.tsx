import { getMission, updateMission } from '../actions'
import { getProjects } from '../../projects/actions'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SubtaskList } from '@/components/missions/subtask-list'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'

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
    { label: 'Feature', value: 'feature' },
    { label: 'Étude', value: 'study' },
    { label: 'Support', value: 'support' },
    { label: 'Docs', value: 'docs' },
    { label: 'Autre', value: 'other' },
  ]

  const missionStatuses = [
    { label: 'À faire', value: 'todo' },
    { label: 'En cours', value: 'in_progress' },
    { label: 'Terminé', value: 'done' },
  ]

  const projectOptions = projects.map(p => ({ label: p.name, value: p.id }))

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <InlineEditableField
                value={mission.type}
                type="select"
                options={missionTypes}
                onSave={async (val) => {
                  'use server'
                  await updateMission(id, { type: val })
                }}
                displayClassName="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
              />
              <InlineEditableField
                value={mission.status}
                type="select"
                options={missionStatuses}
                onSave={async (val) => {
                  'use server'
                  await updateMission(id, { status: val })
                }}
                displayClassName="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400"
              />
            </div>
            
            <InlineEditableField
              value={mission.title}
              onSave={async (val) => {
                'use server'
                await updateMission(id, { title: val })
              }}
              displayClassName="text-4xl font-bold tracking-tight h-auto py-1"
              className="text-4xl"
            />
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Objectif</h3>
              <InlineEditableField
                value={mission.goal}
                onSave={async (val) => {
                  'use server'
                  await updateMission(id, { goal: val })
                }}
                type="textarea"
                displayClassName="text-lg text-slate-700 dark:text-slate-300 min-h-[3rem]"
                placeholder="Décrire l'objectif principal..."
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Notes</h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <InlineEditableField
                  value={mission.notes}
                  onSave={async (val) => {
                    'use server'
                    await updateMission(id, { notes: val })
                  }}
                  type="textarea"
                  displayClassName="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap min-h-[4rem]"
                  placeholder="Ajouter des notes complémentaires..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Estimation</p>
              <InlineEditableField
                value={mission.estimation}
                type="number"
                onSave={async (val) => {
                  'use server'
                  await updateMission(id, { estimation: val })
                }}
                displayClassName="text-sm font-bold"
                placeholder="Estimation..."
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Confiance</p>
              <InlineEditableField
                value={mission.confidence}
                type="number"
                onSave={async (val) => {
                  'use server'
                  await updateMission(id, { confidence: val })
                }}
                displayClassName="text-sm font-bold"
                placeholder="Confiance %..."
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Projet</p>
              <InlineEditableField
                value={mission.project_id}
                type="select"
                options={projectOptions}
                onSave={async (val) => {
                  'use server'
                  await updateMission(id, { project_id: val === 'none' ? null : val })
                }}
                displayClassName="text-sm font-bold"
                placeholder="Assigner un projet..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#15202b] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
          <SubtaskList missionId={mission.id} />
        </div>
      </div>
    </div>
  )
}
