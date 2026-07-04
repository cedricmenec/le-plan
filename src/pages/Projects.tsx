import { useEffect, useState } from 'react'
import { getProjects } from '@/app/projects/actions'
import { ProjectGrid } from '@/components/projects/project-grid'

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects().then(data => {
      setProjects(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <ProjectGrid projects={projects} />
    </div>
  )
}