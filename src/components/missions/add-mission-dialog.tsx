import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MissionForm } from './mission-form'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'

interface AddMissionDialogProps {
  children: React.ReactNode
  initialProjectId?: string
  isProjectLocked?: boolean
}

export function AddMissionDialog({ children, initialProjectId, isProjectLocked }: AddMissionDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSuccess = (mission: any) => {
    setOpen(false)
    window.dispatchEvent(new Event('missions:created'))

    toast({
      variant: 'success',
      title: 'Mission créée avec succès',
      description: `La mission "${mission.title}" a été ajoutée.`,
      action: (
        <ToastAction altText="Voir la mission" asChild>
          <Link to={`/missions/${mission.id}`}>Voir</Link>
        </ToastAction>
      ),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Mission</DialogTitle>
        </DialogHeader>
        <MissionForm 
          onSuccess={handleSuccess} 
          initialProjectId={initialProjectId} 
          isProjectLocked={isProjectLocked}
        />
      </DialogContent>
    </Dialog>
  )
}