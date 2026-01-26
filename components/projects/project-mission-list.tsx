'use client'

import { useState, useEffect, useCallback } from 'react'
import { MissionList } from '@/components/missions/mission-list'
import { createClient } from '@/lib/supabase/client'
import { MissionWithProject } from '@/components/missions/mission-card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ProjectMissionListProps {
  projectId: string
  initialMissions: MissionWithProject[]
}

export function ProjectMissionList({ projectId, initialMissions }: ProjectMissionListProps) {

  const [missions, setMissions] = useState<MissionWithProject[]>(initialMissions)

  const [loading, setLoading] = useState(false)

  const supabase = createClient()



  const fetchMissions = useCallback(async () => {

    setLoading(true)

    const { data, error } = await supabase

      .from('missions')

      .select('*, projects(name)')

      .eq('project_id', projectId)

      .order('estimated_delivery_date', { ascending: true, nullsFirst: false })

      .order('created_at', { ascending: false })



    if (error) {

      console.error('Erreur lors du chargement des missions:', error)

    } else {

      setMissions(data || [])

    }

    setLoading(false)

  }, [projectId, supabase])



  // Initial fetch/sync if needed, though we have initialMissions

  useEffect(() => {

    // Listen for global mission updates (e.g. from AddMissionDialog if used here)

    const onCreated = () => fetchMissions()

    window.addEventListener('missions:created', onCreated)

    return () => window.removeEventListener('missions:created', onCreated)

  }, [fetchMissions])



  const filteredMissions = missions.filter((m) => {

    return m.status !== 'done'

  })



  return (

    <div className="space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <Button variant="ghost" asChild className="-ml-2 h-8">

          <Link href="/projects">

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

          />

        )}

      </div>

    </div>

  )

}
