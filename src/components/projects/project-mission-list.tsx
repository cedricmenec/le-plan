'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MissionList } from '@/components/missions/mission-list'
import { MissionWithProject } from '@/components/missions/mission-card'
import { MissionState } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getMission } from '@/app/missions/actions' // Not directly needed but type check

interface ProjectMissionListProps {
  projectId: string
  initialMissions: MissionWithProject[]
}

export function ProjectMissionList({ projectId, initialMissions }: ProjectMissionListProps) {
  const [missions, setMissions] = useState<MissionWithProject[]>(initialMissions)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setMissions(initialMissions)
  }, [initialMissions])

  // We should ideally have a getProjectMissions action, but for now we'll rely on the parent providing updates 
  // or a full page refresh until we refactor this component to use a server action properly.
  // The current MissionList handles updates by calling a prop.
  
  const fetchMissions = useCallback(async () => {
     // For now, if we need to refresh, we just revalidate or use the existing event pattern
     // But we shouldn't use Supabase here anymore.
     // In a real scenario, we'd call a Prisma-based server action.
  }, [])

  useEffect(() => {
    // Listen for global mission updates
    const onCreated = () => window.location.reload()
    window.addEventListener('missions:created', onCreated)
    return () => window.removeEventListener('missions:created', onCreated)
  }, [])

  const filteredMissions = missions.filter((m) => {
    return m.state !== MissionState.Terminated
  })



  return (

    <div className="space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <Button variant="ghost" asChild className="-ml-2 h-8">

          <Link to="/projects">

            <ArrowLeft className="mr-2 h-4 w-4" />

            Retour aux projets

          </Link>

        </Button>

      </div>


      <div className="space-y-4">

        {loading && missions.length === 0 ? (
          <p className="text-muted-foreground animate-pulse">Chargement des missions...</p>
        ) : (
          <MissionList
            initialMissions={filteredMissions}
            onUpdate={fetchMissions}
            layout="split"
            projectId={projectId}
          />

        )}
      </div>
    </div>

  )

}
