'use client'

import { Database } from '@/types/database.types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MoreHorizontal, Edit2, Trash2, CheckSquare, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project
  missionCount: number
  activeTaskCount: number
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ProjectCard({ project, missionCount, activeTaskCount, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-0">
        <span className="sr-only">Voir le détail du projet {project.name}</span>
      </Link>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative z-10">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.color }} 
                    aria-label="Code couleur du projet"
                />
                <CardTitle className="text-base font-semibold leading-none">
                {project.name}
                </CardTitle>
            </div>
          {project.label && (
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm w-fit">
              {project.label}
            </span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/projects/${project.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Voir le détail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(project)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            
            {missionCount > 0 ? (
                <div title="Impossible de supprimer un projet avec des missions rattachées. L'archivage arrive bientôt !">
                    <DropdownMenuItem disabled className="text-destructive opacity-50">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                    </DropdownMenuItem>
                </div>
            ) : (
                <DropdownMenuItem onClick={() => onDelete(project)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="relative z-10 pointer-events-none">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {project.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckSquare className="h-4 w-4" />
          <span>{activeTaskCount} tâches à faire</span>
        </div>
      </CardContent>
    </Card>
  )
}
