'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MissionTimeline } from './mission-timeline'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import { PriorityBadge } from './priority-badge'
import { MissionStateActions } from './mission-state-actions'
import { Button } from '@/components/ui/button'
import { EditMissionModal } from './edit-mission-modal'
import { DeleteMissionDialog } from './delete-mission-dialog'
import { deleteMission } from '@/app/missions/actions'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { romToDays, calculateTaskRemainingLoad, ROM_MAPPING, ROMSize } from '@/lib/load-utils'
import { 
  ShieldCheck, 
  AlertTriangle, 
  Smartphone, 
  BookOpen, 
  Wrench, 
  FileText, 
  MoreHorizontal, 
  MoreVertical,
  User, 
  History,
  Shirt,
  ListTodo,
  Info,
  Settings2,
  X,
  Pencil,
  Trash2
} from 'lucide-react'

const ROM_OPTIONS = Object.keys(ROM_MAPPING).map(size => ({
  label: `${size} (~${ROM_MAPPING[size as ROMSize]}j)`,
  value: size
}))

const LOAD_SOURCE_OPTIONS = [
  { label: 'T-Shirt (ROM)', value: 'rom', icon: Shirt },
  { label: 'Somme des tâches', value: 'tasks', icon: ListTodo },
]

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
}

export function MissionHeaderHero({ mission, onUpdate }: MissionHeaderHeroProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const currentType = MISSION_TYPES.find(t => t.value === mission.type) || MISSION_TYPES[4]
  const TypeIcon = currentType.icon

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteMission(mission.id)
      toast({
        title: 'Mission supprimée',
        description: 'La mission a été supprimée avec succès.',
      })
      router.push(mission.project_id ? `/projects/${mission.project_id}` : '/')
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
                href={`/projects/${mission.project_id}`}
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

          <MissionStateActions 
            state={mission.state} 
            reason={mission.reason} 
            onUpdate={onUpdate} 
          />
        </div>

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
      </div>

      {/* Title */}
      <InlineEditableField
        value={mission.title}
        onSave={async (val) => {
          await onUpdate({ title: val })
        }}
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
}

export function MissionHeroBlock({ mission, onUpdate }: MissionHeroBlockProps) {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isAlertDismissed, setIsAlertDismissed] = React.useState(false)
  const confidence = mission.confidence || 0
  const isHighConfidence = confidence >= 80

  const romDays = romToDays(mission.rom_size as ROMSize)
  const tasksDays = calculateTaskRemainingLoad(mission.subtasks || [])
  const officialEstimation = mission.load_source === 'tasks' ? tasksDays : romDays

  const showSuggestion = !isAlertDismissed && mission.load_source === 'rom' && (mission.subtasks?.length > 0) && tasksDays > 0

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900/40 p-8 md:p-10 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-8">
      {/* Smart Suggestion - Keep highly visible at top if present */}
      {showSuggestion && (
        <div 
          className="flex items-center justify-between gap-3 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-medium border border-blue-100 dark:border-blue-900/30 group mb-4"
        >
          <div 
            className="flex items-center gap-3 cursor-pointer flex-1"
            onClick={() => onUpdate?.({ load_source: 'tasks' })}
          >
            <Info className="h-4 w-4 shrink-0" />
            <span>Cette mission a des tâches estimées. Passer à la charge par tâches ({tasksDays}j) ?</span>
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
        estimation={officialEstimation}
        estimatedDelivery={mission.estimated_delivery_date}
        desiredDelivery={mission.desired_delivery_date}
      />

      {/* Estimation Settings Collapsible */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon-sm"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ${isSettingsOpen ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200' : ''}`}
            title="Configuration de l'estimation"
            aria-label="Configuration de l'estimation"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {isSettingsOpen ? 'Estimation Settings' : ''}
          </span>
        </div>

        {isSettingsOpen && (
          <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-none p-6 animate-in fade-in slide-in-from-top-1 duration-200 shadow-none">
            <div className="flex flex-wrap items-center gap-10">
              {/* ROM Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Shirt className="h-3 w-3" />
                  Estimation ROM
                </label>
                <InlineEditableField
                  value={mission.rom_size}
                  type="select"
                  options={ROM_OPTIONS}
                  onSave={async (val) => {
                    onUpdate?.({ rom_size: val })
                  }}
                  placeholder="Choisir Taille..."
                  displayClassName="text-sm font-bold text-slate-700 dark:text-slate-300"
                />
              </div>

              {/* Load Source Toggle */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="h-3 w-3" />
                  Source Officielle
                </label>
                <InlineEditableField
                  value={mission.load_source}
                  type="select"
                  options={LOAD_SOURCE_OPTIONS}
                  onSave={async (val) => {
                    onUpdate?.({ load_source: val })
                  }}
                  displayClassName="text-sm font-bold text-blue-600 dark:text-blue-400"
                />
              </div>

              {/* Comparison Display */}
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col items-center min-w-[60px]">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">ROM</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">{romDays}j</span>
                </div>
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col items-center min-w-[60px]">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Tâches</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">{tasksDays}j</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-800" />

      {/* Bottom Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence Score</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{confidence}%</span>
            {isHighConfidence ? (
              <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded-full">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            )}
          </div>
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