'use client'

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  SignalLow, 
  SignalMedium, 
  SignalHigh, 
  AlertTriangle,
  LucideIcon
} from "lucide-react"
import { PriorityLevel } from "./priority-badge"
import { cn } from "@/lib/utils"

interface PrioritySelectProps {
  value: PriorityLevel
  onValueChange: (value: PriorityLevel) => void
  className?: string
  disabled?: boolean
}

const PRIORITIES: { value: PriorityLevel, label: string, icon: LucideIcon, colorClass: string }[] = [
  { 
    value: 'low', 
    label: 'Basse', 
    icon: SignalLow,
    colorClass: 'text-slate-600 dark:text-slate-400'
  },
  { 
    value: 'medium', 
    label: 'Moyenne', 
    icon: SignalMedium,
    colorClass: 'text-blue-600 dark:text-blue-400'
  },
  { 
    value: 'high', 
    label: 'Haute', 
    icon: SignalHigh,
    colorClass: 'text-orange-600 dark:text-orange-400'
  },
  { 
    value: 'critical', 
    label: 'CRITIQUE', 
    icon: AlertTriangle,
    colorClass: 'text-red-600 dark:text-red-400'
  }
]

export function PrioritySelect({ value, onValueChange, className, disabled }: PrioritySelectProps) {
  return (
    <Select 
      value={value} 
      onValueChange={(v) => onValueChange(v as PriorityLevel)}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="Sélectionner la priorité" />
      </SelectTrigger>
      <SelectContent>
        {PRIORITIES.map((p) => {
          const Icon = p.icon
          return (
            <SelectItem key={p.value} value={p.value}>
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", p.colorClass)} />
                <span>{p.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
