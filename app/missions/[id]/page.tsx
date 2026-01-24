import { getMission } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SubtaskList } from '@/components/missions/subtask-list'

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
  try {
    mission = await getMission(id)
  } catch (error) {
    console.error('Error fetching mission:', error)
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

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                {mission.type}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400">
                {mission.status}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{mission.title}</h1>
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Objectif</h3>
              <p className="text-lg text-slate-700 dark:text-slate-300">
                {mission.goal || <span className="italic text-muted-foreground">Aucun objectif défini</span>}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Notes</h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <p className="text-sm whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                  {mission.notes || <span className="italic text-muted-foreground">Aucune note</span>}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Estimation</p>
              <p className="text-sm font-bold">{mission.estimation} j</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Confiance</p>
              <p className="text-sm font-bold">{mission.confidence}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Projet</p>
              <p className="text-sm font-bold">{mission.projects?.name || 'Aucun'}</p>
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
