'use client'

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MissionTimeline } from './mission-timeline'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import { PriorityBadge } from './priority-badge'
import { MissionStateActions } from './mission-state-actions'
import { Button } from '@/components/ui/button'
import { EditMissionModal } from './edit-mission-modal'
import { DeleteMissionDialog } from './delete-mission-dialog'
import { deleteMission, reopenMission } from '@/app/missions/actions'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { calculateTaskRemainingLoad } from '@/lib/load-utils'
import { ConfidenceSelect, CONFIDENCE_LABELS } from '@/components/ui/confidence-select'
import { 
  Smartphone, 
  BookOpen, 
  Wrench, 
  FileText, 
  MoreHorizontal, 
  MoreVertical,
  User, 
  History,
  Info,
  X,
  Pencil,
  Trash2,
  RotateCcw,
  Archive
} from 'lucide-react'

const MISSION_TYPES = [
  { label: 'Feature', value: 'feature', icon: Smartphone, color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20' },
  { label: 'Étude', value: 'study', icon: BookOpen, color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20' },
  { label: 'Support', value: 'support', icon: Wrench, color: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20' },
  { label: 'Docs', value: 'docs', icon: FileText, color: 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/20' },
  { label: 'Autre', value: 'other', icon: MoreHorizontal, color: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-900/20' },
]

interface MissionHeaderHeroProps {
  mission: any
  onUpdate: (updates: any) => Promise<void>
  readonly?: boolean
}

export function MissionHeaderHero({ mission, onUpdate, readonly }: MissionHeaderHeroProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isReopening, setIsReopening] = React.useState(false)

  const currentType = MISSION_TYPES.find(t => t.value === mission.type) || MISSION_TYPES[4]
  const TypeIcon = currentType.icon

  const handleReopen = async () => {
    try {
      setIsReopening(true)
      await reopenMission(mission.id)
      toast({
        title: 'Mission réouverte',
        description: 'La mission a été déplacée vers "À venir".',
      })
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de réouvrir la mission.',
        variant: 'destructive',
      })
    } finally {
      setIsReopening(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteMission(mission.id)
      toast({
        title: 'Mission supprimée',
        description: 'La mission a été supprimée avec succès.',
      })
      navigate(mission.project_id ? `/projects/${mission.project_id}` : '/')
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Metadata Row: Project, Type, and Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {mission.projects && (
            <div className="flex items-center gap-2">
              <Link 
                to={`/projects/${mission.project_id}`}
                className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-primary transition-colors"
              >
                {mission.projects.name}
              </Link>
              <span className="text-[10px] text-slate-300">/</span>
            </div>
          )}
          
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${currentType.color}`}>
            <TypeIcon className="h-3.5 w-3.5" />
            <span>{currentType.label}</span>
          </div>

          {readonly ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold tracking-[0.2em]">
              <Archive className="h-3 w-3" />
              ARCHIVE
            </div>
          ) : (
            <MissionStateActions 
              state={mission.state} 
              reason={mission.reason} 
              estimation={mission.estimation}
              subtasks={mission.subtasks}
              onUpdate={onUpdate} 
            />
          )}
        </div>

        {readonly ? (
          <Button 
            onClick={handleReopen} 
            disabled={isReopening}
            variant="outline" 
            size="sm"
            className="h-8 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 font-bold text-[10px] tracking-widest uppercase hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all rounded-full px-4"
          >
            {isReopening ? (
              'Réouverture...'
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5 mr-2" />
                RÉOUVRIR
              </>
            )}
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                aria-label="Actions de la mission"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Modifier</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Title */}
      <InlineEditableField
        value={mission.title}
        onSave={async (val) => {
          await onUpdate({ title: val })
        }}
        trigger={readonly ? undefined : "doubleClick"}
        displayClassName="text-3xl font-extrabold tracking-tight h-auto py-1 text-slate-900 dark:text-white"
        className="text-3xl"
      />

      <EditMissionModal
        mission={mission}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={async (updates) => {
          await onUpdate(updates)
          setIsEditModalOpen(false)
        }}
      />

      <DeleteMissionDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  )
}

interface MissionHeroBlockProps {
  mission: any
  onUpdate?: (updates: any) => Promise<void>
  readonly?: boolean
}

export function MissionHeroBlock({ mission, onUpdate, readonly }: MissionHeroBlockProps) {
  const [isAlertDismissed, setIsAlertDismissed] = React.useState(false)
  const tasksDays = calculateTaskRemainingLoad(mission.subtasks || [])
  const showSuggestion = !readonly && !isAlertDismissed && mission.subtasks?.length > 0 && tasksDays > 0 && tasksDays !== mission.estimation

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900/40 p-8 md:p-10 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-8">
      {/* Smart Suggestion - Keep highly visible at top if present */}
      {showSuggestion && (
        <div 
          className="flex items-center justify-between gap-3 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-medium border border-blue-100 dark:border-blue-900/30 group mb-4"
        >
          <div 
            className="flex items-center gap-3 cursor-pointer flex-1"
            onClick={() => onUpdate?.({ estimation: tasksDays })}
          >
            <Info className="h-4 w-4 shrink-0" />
            <span>Charge restante par tâches : {tasksDays}j. Ajuster l'estimation ?</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setIsAlertDismissed(true)
            }}
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors text-blue-400 hover:text-blue-600 dark:hover:text-blue-200"
            aria-label="Fermer la notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Timeline visualization */}
      <MissionTimeline 
        estimation={mission.estimation}
        estimatedDelivery={mission.estimated_delivery_date}
        desiredDelivery={mission.desired_delivery_date}
        readonly={readonly}
      />

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900/50">Estimation mission : <strong>{mission.estimation}j</strong> · Charge restante par tâches : <strong>{tasksDays}j</strong></div>

      <div className="h-px bg-slate-100 dark:bg-slate-800" />

      {/* Bottom Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confiance{mission.confidence ? ` · ${CONFIDENCE_LABELS[mission.confidence as 1|2|3|4|5]}` : ''}</p>
          <ConfidenceSelect value={mission.confidence} disabled={readonly} onChange={confidence => onUpdate?.({ confidence })} />
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</p>
          <div className="flex items-center gap-2 pt-1">
            <PriorityBadge priority={mission.priority || 'medium'} variant="text" className="text-base" />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-slate-300" />
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">Today</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assignee</p>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">Product Team</span>
          </div>
        </div>
      </div>
    </div>
  )
}
