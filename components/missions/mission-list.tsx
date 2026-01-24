'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MissionCard, MissionWithProject } from './mission-card'
import { CondensedMissionList } from './condensed-mission-list'
import { DeleteMissionDialog } from './delete-mission-dialog'
import { EditMissionModal } from './edit-mission-modal'
import { Database } from '@/types/database.types'
import { sortMissions } from '@/lib/utils'
import {
  TooltipProvider,
} from "@/components/ui/tooltip"

type Mission = Database['public']['Tables']['missions']['Row']

interface MissionListProps {
  initialMissions?: MissionWithProject[]
  onUpdate?: () => void
  layout?: 'grid' | 'split'
  showProjectName?: boolean
}

export function MissionList({ 
  initialMissions, 
  onUpdate, 
  layout = 'grid',
  showProjectName = false 
}: MissionListProps) {
  const [missions, setMissions] = useState<MissionWithProject[]>(initialMissions || [])
  const [loading, setLoading] = useState(!initialMissions)
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null)
  const [missionToEdit, setMissionToEdit] = useState<Mission | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const sortedMissions = useMemo(() => sortMissions(missions), [missions])

  const activeMissions = useMemo(() => 
    sortedMissions.filter(m => m.status === 'in_progress'), 
  [sortedMissions])

  const todoMissions = useMemo(() => 
    sortedMissions.filter(m => m.status === 'todo'), 
  [sortedMissions])

  async function fetchMissions() {
    const { data, error } = await supabase
      .from('missions')
      .select('*, projects(name)')
      .order('estimated_delivery_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors du chargement des missions:', error)
    } else {
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

  const renderGrid = (items: MissionWithProject[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onEdit={() => setMissionToEdit(mission)}
          onDelete={() => setMissionToDelete(mission)}
          isUpdating={updatingId === mission.id}
          isDeleting={deletingId === mission.id}
        />
      ))}
    </div>
  )

  return (
    <TooltipProvider>
      <div className="space-y-10">
        {missions.length === 0 ? (
          <p className="text-muted-foreground italic">Aucune mission pour le moment.</p>
        ) : layout === 'split' ? (
          <>
            {/* Active Missions Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Missions actives
                <span className="text-xs font-normal text-muted-foreground ml-2">({activeMissions.length})</span>
              </h3>
              {activeMissions.length > 0 ? (
                renderGrid(activeMissions)
              ) : (
                <p className="text-sm text-muted-foreground italic py-4 border-2 border-dashed rounded-lg text-center">
                  Aucune mission en cours.
                </p>
              )}
            </div>

            {/* To Do Missions Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                Missions non commencées
                <span className="text-xs font-normal text-muted-foreground ml-2">({todoMissions.length})</span>
              </h3>
              <CondensedMissionList
                missions={todoMissions}
                showProjectName={showProjectName}
                onEdit={(m) => setMissionToEdit(m)}
                onDelete={(m) => setMissionToDelete(m)}
                updatingId={updatingId}
                deletingId={deletingId}
              />
            </div>
          </>
        ) : (
          renderGrid(sortedMissions)
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
          </TooltipProvider>
        )
      }