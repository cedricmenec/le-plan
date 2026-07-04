'use client'

import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { MoreHorizontal, Edit2, Trash2, Eye, Clock, ListTodo } from 'lucide-react'
import { MissionState } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { formatRelativeDuration } from '@/lib/utils'
import { Link } from 'react-router-dom'

type Project = {
  id: string
  name: string
  label: string | null
  description: string | null
  color: string
  image_url: string | null
}

type Mission = {
  id: string
  title: string
  state: MissionState
  estimated_delivery_date: string | null
}

interface ProjectCardProps {
  project: Project
  missions: Mission[]
  onEdit: (project: any) => void
  onDelete: (project: any) => void
}

export function ProjectCard({ project, missions, onEdit, onDelete }: ProjectCardProps) {
  const activeMissions = missions
    .filter(m => m.state === MissionState.Active)
    .sort((a, b) => {
      if (!a.estimated_delivery_date) return 1
      if (!b.estimated_delivery_date) return -1
      return a.estimated_delivery_date.localeCompare(b.estimated_delivery_date)
    })
    .slice(0, 3)

  const upcomingMissionsCount = missions.filter(m => m.state === MissionState.Backlog || m.state === MissionState.Queued).length
  const totalMissions = missions.length

  const placeholderImage = `https://images.unsplash.com/photo-1572177222102-78617f76cc23?q=80&w=1000&auto=format&fit=crop`

  return (
    <Card className="hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col h-full border-slate-200 dark:border-slate-800">
      <Link to={`/projects/${project.id}`} className="absolute inset-0 z-0">
        <span className="sr-only">Voir le détail du projet {project.name}</span>
      </Link>
      
      {/* Hero Image Section */}
      <div 
        className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-900 z-10"
      >
        <img 
          src={project.image_url || placeholderImage} 
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Actions Button (Top Right) */}
        <div className="absolute top-2 right-2 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/20 hover:bg-white/40 backdrop-blur-md border-white/20 text-white rounded-full transition-colors">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to={`/projects/${project.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir le détail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              
              {totalMissions > 0 ? (
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
        </div>

        {/* Project Type/Label (Bottom Left on Image) */}
        {project.label && (
          <div className="absolute bottom-3 left-4 z-20">
            <span className="text-[9px] font-bold text-white/90 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded uppercase tracking-[0.15em] border border-white/10 shadow-sm">
              {project.label}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex flex-col flex-1 relative z-10 pointer-events-none">
        {/* Project Title and Color Code */}
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
            style={{ backgroundColor: project.color }} 
          />
          <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white line-clamp-1">
            {project.name}
          </CardTitle>
        </div>

        {project.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-5 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Active Missions Section */}
        {activeMissions.length > 0 && (
          <div className="space-y-3 mt-auto mb-5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Missions Actives
            </p>
            <div className="space-y-2">
              {activeMissions.map(mission => (
                <div key={mission.id} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {mission.title}
                  </span>
                  {mission.estimated_delivery_date && (
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                      {formatRelativeDuration(mission.estimated_delivery_date)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Summary */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto flex items-center justify-between text-[11px] font-bold">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <ListTodo className="h-3.5 w-3.5" />
            <span>{upcomingMissionsCount} MISSION{upcomingMissionsCount > 1 ? 'S' : ''} À VENIR</span>
          </div>
          <span className="text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
            {totalMissions} MISSION{totalMissions > 1 ? 'S' : ''} TOTAL
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
