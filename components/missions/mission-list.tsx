'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SubtaskList } from './subtask-list'
import { MissionActions } from './mission-actions'
import { DeleteMissionDialog } from './delete-mission-dialog'
import { EditMissionModal } from './edit-mission-modal'

interface Mission {
  id: string
  title: string
  type: string
  estimation: number
  confidence: number
  status: string
  project_parent?: string
}

export function MissionList() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null)
  const [missionToEdit, setMissionToEdit] = useState<Mission | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  async function fetchMissions() {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors du chargement des missions:', error)
    } else {
      setMissions(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMissions()

    const onCreated = () => {
      // another component created a mission — re-fetch to stay in sync
      setLoading(true)
      fetchMissions()
    }

    window.addEventListener('missions:created', onCreated)
    return () => window.removeEventListener('missions:created', onCreated)
  }, [supabase])

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
        fetchMissions()
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
        fetchMissions()
      }
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <p>Chargement des missions...</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mes Missions</h2>
      {missions.length === 0 ? (
        <p className="text-muted-foreground italic">Aucune mission pour le moment.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <Card key={mission.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex flex-col space-y-1">
                  <CardTitle className="text-sm font-medium">
                    {mission.title}
                  </CardTitle>
                  <Badge className="w-fit" variant={mission.status === 'done' ? 'default' : 'secondary'}>
                    {mission.status}
                  </Badge>
                </div>
                <MissionActions 
                  onEdit={() => setMissionToEdit(mission)} 
                  onDelete={() => setMissionToDelete(mission)} 
                />
              </CardHeader>
              <CardContent className={(deletingId === mission.id || updatingId === mission.id) ? 'opacity-50 pointer-events-none relative' : ''}>
                {(deletingId === mission.id || updatingId === mission.id) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/20 z-10">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                )}
                <div className="text-xs text-muted-foreground mb-2 capitalize">
                  {mission.type} {mission.project_parent && `• ${mission.project_parent}`}
                </div>
                <div className="text-sm">
                  Estimation: {mission.estimation} j
                </div>
                <SubtaskList missionId={mission.id} />
              </CardContent>
            </Card>
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
  )
}
