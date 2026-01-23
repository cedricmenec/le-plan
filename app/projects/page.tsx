import { getProjects } from './actions'
import { ProjectGrid } from '@/components/projects/project-grid'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const projects = await getProjects()

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <ProjectGrid projects={projects || []} />
    </div>
  )
}
