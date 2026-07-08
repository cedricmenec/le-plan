import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { MissionState } from '@/lib/types'

const main: MissionState[] = ['Backlog', 'Queued', 'Active', 'Terminated']

export function MissionLifecycle({ mission }: { mission: { state: MissionState; reason?: string | null; queue_position?: number | null; project_id?: string | null; projects?: { name: string } | null } }) {
  return <section aria-label="Cycle de vie de la mission" className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
    <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Cycle de vie</h3>
    <div className="flex flex-wrap items-center gap-2">
      {main.map((state, index) => <div key={state} className="flex items-center gap-2">
        {index > 0 && <span aria-hidden className="text-slate-300">→</span>}
        <span aria-current={mission.state === state ? 'step' : undefined} className={cn('rounded-full border px-3 py-1 text-xs', mission.state === state && 'border-blue-600 bg-blue-600 font-bold text-white')}>{state}</span>
      </div>)}
      <span aria-hidden className="text-slate-300">↳</span>
      <span aria-current={mission.state === 'Suspended' ? 'step' : undefined} className={cn('rounded-full border px-3 py-1 text-xs', mission.state === 'Suspended' && 'border-amber-600 bg-amber-600 font-bold text-white')}>Suspended{mission.state === 'Suspended' && mission.reason ? ` · ${mission.reason}` : ''}</span>
    </div>
    {mission.state === 'Queued' && <p className="mt-4 text-sm">Rang <strong>#{(mission.queue_position ?? 0) + 1}</strong> dans {mission.projects?.name ?? 'la file autonome'}{mission.project_id && <> · <Link className="font-semibold text-blue-600 hover:underline" to={`/projects/${mission.project_id}`}>Voir la file du projet</Link></>}</p>}
  </section>
}
