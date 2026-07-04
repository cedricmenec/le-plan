'use client';

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject, getRecentlyCompletedMissions } from '@/app/projects/actions'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ProjectMissionList } from '@/components/projects/project-mission-list'
import { RecentlyCompletedMissions } from '@/components/missions/recently-completed-missions'
import { ProjectHeader } from '@/components/projects/project-header'

export function ProjectDetailContent() {
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<any>(null)
  const [recentlyCompleted, setRecentlyCompleted] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [projectData, completedData] = await Promise.all([
          getProject(id),
          getRecentlyCompletedMissions(id, -1)
        ])
        if (cancelled) return
        if (!projectData) { setError(true); return }
        setProject(projectData)
        setRecentlyCompleted(completedData || [])
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return null // fallback handled by React Router error route
  }

  const initialMissions = project.missions || []

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <Breadcrumb items={[{ label: 'Projects', href: '/projects' }, { label: project.name }]} />
      <ProjectHeader project={project} />
      <ProjectMissionList projectId={id} initialMissions={initialMissions} />
      <RecentlyCompletedMissions projectId={id} initialMissions={recentlyCompleted} />
    </div>
  )
}