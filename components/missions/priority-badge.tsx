'use client'

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  SignalLow, 
  SignalMedium, 
  SignalHigh, 
  AlertTriangle,
  LucideIcon
} from "lucide-react"

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical'

interface PriorityBadgeProps {
  priority: PriorityLevel
  className?: string
  showIcon?: boolean
}

const PRIORITY_CONFIG: Record<PriorityLevel, { 
  label: string, 
  icon: LucideIcon, 
  colorClass: string 
}> = {
  low: {
    label: 'Basse',
    icon: SignalLow,
    colorClass: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
  },
  medium: {
    label: 'Moyenne',
    icon: SignalMedium,
    colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
  },
  high: {
    label: 'Haute',
    icon: SignalHigh,
    colorClass: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800'
  },
  critical: {
    label: 'CRITIQUE',
    icon: AlertTriangle,
    colorClass: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 animate-pulse'
  }
}

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium
  const Icon = config.icon

  return (
    <Badge 
      variant="outline" 
      className={cn("font-bold tracking-wider", config.colorClass, className)}
    >
      {showIcon && <Icon className="h-3.5 w-3.5 mr-1" />}
      {config.label}
    </Badge>
  )
}
