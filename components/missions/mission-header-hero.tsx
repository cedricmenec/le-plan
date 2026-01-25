'use client'

import Link from 'next/link'
import { MissionTimeline } from './mission-timeline'
import { InlineEditableField } from '@/components/ui/inline-editable-field/inline-editable-field'
import { ShieldCheck, AlertTriangle, Smartphone, BookOpen, Wrench, FileText, MoreHorizontal } from 'lucide-react'

interface MissionHeaderHeroProps {
  mission: any
  onUpdate: (updates: any) => Promise<void>
}

const MISSION_TYPES = [
  { label: 'Feature', value: 'feature', icon: Smartphone, color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20' },
  { label: 'Étude', value: 'study', icon: BookOpen, color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20' },
  { label: 'Support', value: 'support', icon: Wrench, color: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20' },
  { label: 'Docs', value: 'docs', icon: FileText, color: 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/20' },
  { label: 'Autre', value: 'other', icon: MoreHorizontal, color: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-900/20' },
]

const MISSION_STATUSES = [
  { label: 'À faire', value: 'todo' },
  { label: 'En cours', value: 'in_progress' },
  { label: 'Terminé', value: 'done' },
]

export function MissionHeaderHero({ mission, onUpdate }: MissionHeaderHeroProps) {
  const currentType = MISSION_TYPES.find(t => t.value === mission.type) || MISSION_TYPES[4]
  const TypeIcon = currentType.icon
  const confidence = mission.confidence || 0
  const isHighConfidence = confidence >= 80

  return (
    <div className="space-y-6">
      {/* Project Context */}
      {mission.projects && (
        <div className="flex items-center gap-2">
          <Link 
            href={`/projects/${mission.project_id}`}
            className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
          >
            {mission.projects.name}
          </Link>
          <span className="text-[10px] text-slate-300">/</span>
        </div>
      )}

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${currentType.color}`}>
              <TypeIcon className="h-3.5 w-3.5" />
              <span>{currentType.label}</span>
            </div>
            <InlineEditableField
              value={mission.status}
              type="select"
              options={MISSION_STATUSES}
              onSave={async (val) => {
                await onUpdate({ status: val })
              }}
              displayClassName="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            />
          </div>

          <InlineEditableField
            value={mission.title}
            onSave={async (val) => {
              await onUpdate({ title: val })
            }}
            displayClassName="text-5xl font-extrabold tracking-tight h-auto py-1 text-slate-900 dark:text-white"
            className="text-5xl"
          />
        </div>

        {/* Discreet Metrics */}
        <div className="flex items-center gap-6 pb-2">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confiance</p>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${
              isHighConfidence 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-300'
            }`}>
              {isHighConfidence ? <ShieldCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              <span className="text-sm font-bold">{confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Hero Block */}
      <div className="bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <MissionTimeline 
          estimation={mission.estimation}
          estimatedDelivery={mission.estimated_delivery_date}
          desiredDelivery={mission.desired_delivery_date}
        />
      </div>
    </div>
  )
}
