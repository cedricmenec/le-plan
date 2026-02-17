'use client'

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MissionState, MissionReason } from "@prisma/client"
import { 
  Inbox, 
  ListTodo, 
  Play, 
  PauseCircle, 
  CheckCircle2, 
  XCircle,
  AlertOctagon,
  Clock,
  LucideIcon
} from "lucide-react"

interface StateBadgeProps {
  state: MissionState
  reason?: MissionReason | null
  className?: string
}

const STATE_CONFIG: Record<string, { 
  label: string, 
  icon: LucideIcon, 
  colorClass: string 
}> = {
  [MissionState.Backlog]: {
    label: 'Backlog',
    icon: Inbox,
    colorClass: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  },
  [MissionState.Queued]: {
    label: 'Next up',
    icon: ListTodo,
    colorClass: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
  },
  [MissionState.Active]: {
    label: 'En cours',
    icon: Play,
    colorClass: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
  },
  // Reasons for Suspended
  [`${MissionState.Suspended}_${MissionReason.Blocked}`]: {
    label: 'Bloqué',
    icon: AlertOctagon,
    colorClass: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
  },
  [`${MissionState.Suspended}_${MissionReason.Deprioritized}`]: {
    label: 'Dépriorisé',
    icon: Clock,
    colorClass: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
  },
  // Reasons for Terminated
  [`${MissionState.Terminated}_${MissionReason.Done}`]: {
    label: 'Terminé',
    icon: CheckCircle2,
    colorClass: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
  },
  [`${MissionState.Terminated}_${MissionReason.Cancelled}`]: {
    label: 'Annulé',
    icon: XCircle,
    colorClass: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  }
}

export function StateBadge({ state, reason, className }: StateBadgeProps) {
  let key = state as string
  if (state === MissionState.Suspended || state === MissionState.Terminated) {
    if (reason) {
      key = `${state}_${reason}`
    }
  }

  const config = STATE_CONFIG[key] || { 
    label: state, 
    icon: state === MissionState.Suspended ? PauseCircle : state === MissionState.Terminated ? CheckCircle2 : Inbox,
    colorClass: 'bg-slate-100 text-slate-600 border-slate-200'
  }
  
  const Icon = config.icon

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium gap-1", config.colorClass, className)}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  )
}
