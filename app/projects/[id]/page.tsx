import { getProject } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/breadcrumb'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  try {
    const project = await getProject(id)
    if (!project) {
      return notFound()
    }

    return (
      <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
        <Breadcrumb 
          items={[
            { label: 'Projects', href: '/projects' },
            { label: project.name }
          ]} 
        />
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2">
            {project.label && (
              <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                {project.label}
              </span>
            )}
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>

        {/* Placeholder for Dashboard and Mission List */}
        <div className="grid gap-6">
          <div className="h-40 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Project Dashboard Placeholder
          </div>
          <div className="h-80 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Mission List Placeholder
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching project:', error)
    return notFound()
  }
}
