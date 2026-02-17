'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddMissionDialog } from '@/components/missions/add-mission-dialog'

interface ProjectHeaderProps {
  project: {
    id: string
    name: string
    label?: string | null
    description?: string | null
  }
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <div className="flex items-center gap-2">
          {project.label && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
              {project.label}
            </span>
          )}
          {project.description && (
            <p className="text-muted-foreground text-sm">{project.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <AddMissionDialog initialProjectId={project.id} isProjectLocked={true}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Mission
          </Button>
        </AddMissionDialog>
      </div>
    </div>
  )
}
