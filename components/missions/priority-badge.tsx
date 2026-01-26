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
  variant?: 'badge' | 'text'
}

const PRIORITY_CONFIG: Record<PriorityLevel, { 
  label: string, 
  labelEn: string,
  icon: LucideIcon, 
  colorClass: string,
  textColorClass: string
}> = {
  low: {
    label: 'Basse',
    labelEn: 'LOW',
    icon: SignalLow,
    colorClass: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    textColorClass: 'text-slate-500 dark:text-slate-400'
  },
  medium: {
    label: 'Moyenne',
    labelEn: 'MEDIUM',
    icon: SignalMedium,
    colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    textColorClass: 'text-blue-500 dark:text-blue-400'
  },
  high: {
    label: 'Haute',
    labelEn: 'HIGH',
    icon: SignalHigh,
    colorClass: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    textColorClass: 'text-orange-500 dark:text-orange-400'
  },
  critical: {
    label: 'CRITIQUE',
    labelEn: 'CRITICAL',
    icon: AlertTriangle,
    colorClass: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 animate-pulse',
    textColorClass: 'text-red-500 dark:text-red-400 font-bold'
  }
}

export function PriorityBadge({ priority, className, showIcon = true, variant = 'badge' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium
  const Icon = config.icon

  if (variant === 'text') {
    return (
      <div className={cn("flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase", config.textColorClass, className)}>
        {showIcon && <Icon className="h-3.5 w-3.5" />}
        <span>{config.labelEn}</span>
      </div>
    )
  }

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
