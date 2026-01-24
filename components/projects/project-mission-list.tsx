'use client'

import { useState, useEffect, useCallback } from 'react'
import { MissionList } from '@/components/missions/mission-list'
import { ProjectDashboard } from './project-dashboard'
import { createClient } from '@/lib/supabase/client'
import { MissionWithProject } from '@/components/missions/mission-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ProjectMissionListProps {
  projectId: string
  initialMissions: MissionWithProject[]
}

export function ProjectMissionList({ projectId, initialMissions }: ProjectMissionListProps) {
  const [missions, setMissions] = useState<MissionWithProject[]>(initialMissions)
  const [filter, setFilter] = useState<'active' | 'all'>('active')
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
    if (m.status === 'done') return false
    if (filter === 'active') return m.status === 'in_progress'
    return true // Includes 'todo' and 'in_progress'
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
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtrer:</span>
          <Select value={filter} onValueChange={(v: 'active' | 'all') => setFilter(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Missions actives</SelectItem>
              <SelectItem value="all">Toutes (incl. à faire)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProjectDashboard missions={missions} />

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