'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { MissionCard, MissionWithProject } from './mission-card'
import { DeleteMissionDialog } from './delete-mission-dialog'
import { EditMissionModal } from './edit-mission-modal'
import { Database } from '@/types/database.types'
import {
  TooltipProvider,
} from "@/components/ui/tooltip"

type Mission = Database['public']['Tables']['missions']['Row']

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
    <TooltipProvider>
      <div className="space-y-6">
        {missions.length === 0 ? (
          <p className="text-muted-foreground italic">Aucune mission pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission) => (
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
      