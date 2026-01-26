'use client'

import { Database } from '@/types/database.types'
import { ProjectCard } from './project-card'
import { useState } from 'react'
import { AddProjectDialog } from './add-project-dialog'
import { EditProjectModal } from './edit-project-modal'
import { deleteProject, updateProject } from '@/app/projects/actions'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (data: any) => {
    if (!projectToEdit) return
    setLoading(true)
    try {
      await updateProject(projectToEdit.id, data)
      setProjectToEdit(null)
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (project: Project) => {
    if (!confirm(`Supprimer le projet "${project.name}" ?`)) return
    try {
      await deleteProject(project.id)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground">Gérez vos projets et objectifs.</p>
        </div>
        <AddProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">Aucun projet trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => {
            const missions = project.missions || []

            return (
              <ProjectCard
                key={project.id}
                project={project}
                missions={missions}
                onEdit={setProjectToEdit}
                onDelete={handleDelete}
              />
            )
          })}
        </div>
      )}

      <EditProjectModal
        project={projectToEdit}
        open={!!projectToEdit}
        onOpenChange={(open) => !open && setProjectToEdit(null)}
        onSubmit={handleUpdate}
        loading={loading}
      />
    </div>
  )
}
