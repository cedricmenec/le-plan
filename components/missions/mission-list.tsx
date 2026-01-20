'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {mission.title}
                </CardTitle>
                <Badge variant={mission.status === 'done' ? 'default' : 'secondary'}>
                  {mission.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2 capitalize">
                  {mission.type} {mission.project_parent && `• ${mission.project_parent}`}
                </div>
                <div className="text-sm">
                  Estimation: {mission.estimation} j
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
