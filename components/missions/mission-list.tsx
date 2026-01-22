'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SubtaskList } from './subtask-list'
import { MissionActions } from './mission-actions'
import { DeleteMissionDialog } from './delete-mission-dialog'

interface Mission {
  id: string
  title: string
  type: string
  estimation: number
  status: string
  project_parent?: string
}

export function MissionList() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
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

    fetchMissions()

    const onCreated = () => {
      // another component created a mission — re-fetch to stay in sync
      setLoading(true)
      fetchMissions()
    }

    window.addEventListener('missions:created', onCreated)
    return () => window.removeEventListener('missions:created', onCreated)
  }, [supabase])

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
                  onEdit={() => console.log('Edit', mission.id)} 
                  onDelete={() => setMissionToDelete(mission)} 
                />
              </CardHeader>
              <CardContent className={deletingId === mission.id ? 'opacity-50 pointer-events-none' : ''}>
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

      <DeleteMissionDialog
        open={!!missionToDelete}
        onOpenChange={(open) => !open && setMissionToDelete(null)}
        onConfirm={() => {
          if (missionToDelete) {
            console.log('Confirmed delete for', missionToDelete.id)
            setMissionToDelete(null)
          }
        }}
      />
    </div>
  )
}
