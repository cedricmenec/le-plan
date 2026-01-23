'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { MissionActions } from './mission-actions'
import { DeleteMissionDialog } from './delete-mission-dialog'
import { EditMissionModal } from './edit-mission-modal'
import { Database } from '@/types/database.types'
import { 
  Smartphone, 
  BookOpen, 
  Bug, 
  Wrench, 
  FileText, 
  MoreHorizontal, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react'

type Mission = Database['public']['Tables']['missions']['Row']
type MissionWithProject = Mission & { projects: { name: string } | null }

const TYPE_ICONS: Record<string, any> = {
  feature: Smartphone,
  study: BookOpen,
  support: Wrench,
  docs: FileText,
  other: MoreHorizontal,
}

const TYPE_COLORS: Record<string, string> = {
  feature: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
  study: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  support: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  docs: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400',
  other: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400',
}

interface MissionListProps {
  initialMissions?: MissionWithProject[]
  onUpdate?: () => void
}

export function MissionList({ initialMissions, onUpdate }: MissionListProps) {
  const [missions, setMissions] = useState<MissionWithProject[]>(initialMissions || [])
  const [loading, setLoading] = useState(!initialMissions)
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null)
  const [missionToEdit, setMissionToEdit] = useState<Mission | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  async function fetchMissions() {
    const { data, error } = await supabase
      .from('missions')
      .select('*, projects(name)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors du chargement des missions:', error)
    } else {
      // @ts-ignore - Supabase join types can be complex to map strictly without generated helpers
      setMissions(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (initialMissions) {
      setMissions(initialMissions)
      setLoading(false)
    } else {
      fetchMissions()
    }

    const onCreated = () => {
      setLoading(true)
      fetchMissions()
    }

    window.addEventListener('missions:created', onCreated)
    return () => window.removeEventListener('missions:created', onCreated)
  }, [supabase, initialMissions])

  const handleUpdate = async (data: Partial<Mission>) => {
    if (!missionToEdit) return

    setUpdatingId(missionToEdit.id)
    try {
      const { error } = await supabase
        .from('missions')
        .update(data)
        .eq('id', missionToEdit.id)

      if (error) {
        alert('Erreur lors de la mise à jour')
      } else {
        setMissionToEdit(null)
        if (onUpdate) {
            onUpdate()
        } else {
            fetchMissions()
        }
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async () => {
    if (!missionToDelete) return

    const idToDelete = missionToDelete.id
    setDeletingId(idToDelete)
    setMissionToDelete(null)

    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', idToDelete)

      if (error) {
        alert('Erreur lors de la suppression')
      } else {
        if (onUpdate) {
            onUpdate()
        } else {
            fetchMissions()
        }
      }
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <p className="text-slate-500 animate-pulse">Chargement des missions...</p>
  }

  return (
    <div className="space-y-6">
      {missions.length === 0 ? (
        <p className="text-muted-foreground italic">Aucune mission pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const Icon = TYPE_ICONS[mission.type] || TYPE_ICONS.other
            const colorClass = TYPE_COLORS[mission.type] || TYPE_COLORS.other
            const confidence = mission.confidence || 0
            const isHighConfidence = confidence >= 80
            const projectName = mission.projects?.name || mission.project_parent
            
            // Mock progress calculation for UI fidelity
            const progress = mission.status === 'done' ? 100 : Math.min(Math.max(20, (mission.id.charCodeAt(0) % 80)), 90)

            return (
              <div 
                key={mission.id}
                className={`group bg-white dark:bg-[#15202b] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${
                  (deletingId === mission.id || updatingId === mission.id) ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${
                        isHighConfidence 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {isHighConfidence ? <ShieldCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        <span className="text-[11px] font-bold">{confidence}%</span>
                      </div>
                      
                      <MissionActions 
                        onEdit={() => setMissionToEdit(mission)} 
                        onDelete={() => setMissionToDelete(mission)} 
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${colorClass}`}>
                        {mission.type}
                      </span>
                      {projectName && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {projectName}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                      {mission.title}
                    </h4>
                  </div>
                </div>

                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span>Avancement</span>
                    <span>{mission.estimation} j</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        mission.status === 'done' ? 'bg-green-500' : 'bg-primary'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="pt-3 flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-50 dark:border-slate-800/50 mt-4">
                    <span>Statut: {mission.status}</span>
                    <button className="text-primary font-semibold flex items-center gap-1 hover:underline">
                      Détails <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {missionToEdit && (
        <EditMissionModal
          mission={missionToEdit}
          open={!!missionToEdit}
          onOpenChange={(open) => !open && setMissionToEdit(null)}
          onSubmit={handleUpdate}
          onDelete={() => {
            setMissionToDelete(missionToEdit)
            setMissionToEdit(null)
          }}
          loading={updatingId === missionToEdit.id}
        />
      )}

      <DeleteMissionDialog
        open={!!missionToDelete}
        onOpenChange={(open) => !open && setMissionToDelete(null)}
        onConfirm={handleDelete}
        loading={deletingId === (missionToDelete?.id)}
      />
    </div>
  )
}