'use client'

import { MoreVertical, Edit2, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface MilestoneActionsProps {
  onEdit: () => void
  onDelete: () => void
  onOpenChange?: (open: boolean) => void
}

export function MilestoneActions({ onEdit, onDelete, onOpenChange }: MilestoneActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (showConfirm) {
      onDelete()
      setShowConfirm(false)
    } else {
      setShowConfirm(true)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowConfirm(false)
    }
    onOpenChange?.(open)
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Actions">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit2 className="mr-2 h-4 w-4" />
          <span>Modifier</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDeleteClick}
          onSelect={(e) => e.preventDefault()} // Keep menu open to show "Confirmer ?"
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>{showConfirm ? 'Confirmer ?' : 'Supprimer'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}