'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddMissionDialog } from '@/components/missions/add-mission-dialog'
import { MissionSkeletonCard } from '@/components/missions/mission-skeleton-card'

interface ProjectEmptyStateProps {
  projectId?: string
}

export function ProjectEmptyState({ projectId }: ProjectEmptyStateProps) {
  return (
    <div className="relative">
      {/* Ghost Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40 select-none pointer-events-none">
        <MissionSkeletonCard />
        <MissionSkeletonCard />
        <MissionSkeletonCard />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-t from-slate-50/50 via-transparent to-transparent dark:from-slate-950/50">
        <div className="text-center space-y-4 max-w-sm">
          <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No missions yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Start by creating your first mission for this project to track your progress and capacity.
          </p>
          <div className="pt-4">
            <AddMissionDialog projectId={projectId}>
              <Button size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                Create First Mission
              </Button>
            </AddMissionDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
