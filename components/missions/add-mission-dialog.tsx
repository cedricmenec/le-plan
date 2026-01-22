'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MissionForm } from './mission-form'

interface AddMissionDialogProps {
  children: React.ReactNode
}

export function AddMissionDialog({ children }: AddMissionDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
    // Dispatch event to refresh list (existing pattern in project)
    window.dispatchEvent(new Event('missions:created'))
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
        <MissionForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}