'use client'

import { Database } from '@/types/database.types'
import { ProjectCard } from './project-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground">Gérez vos projets et objectifs.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Projet
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">Aucun projet trouvé.</p>
          <Button variant="outline">
             Créer votre premier projet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              missionCount={0} // TODO: Implement stats fetching
              activeTaskCount={0} // TODO: Implement stats fetching
              onEdit={(p) => console.log('Edit', p)}
              onDelete={(p) => console.log('Delete', p)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
