'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProjectForm } from './project-form'
import { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']

interface EditProjectModalProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  loading?: boolean
}

export function EditProjectModal({ project, open, onOpenChange, onSubmit, loading }: EditProjectModalProps) {
  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le projet</DialogTitle>
        </DialogHeader>
        <ProjectForm 
            initialData={project} 
            onSubmit={onSubmit} 
            loading={loading} 
            buttonText="Enregistrer les modifications" 
        />
      </DialogContent>
    </Dialog>
  )
}
