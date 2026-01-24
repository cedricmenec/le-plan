import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDuration(date: Date | string | null): string {
  if (!date) return 'n/a'
  
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  
  // Create date-only versions for comparison
  const targetDateOnly = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  const diffInMs = targetDateOnly.getTime() - nowDateOnly.getTime()
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) {
    return 'en retard'
  }
  
  if (diffInDays === 0) {
    return '0 jour'
  }
  
  if (diffInDays < 14) {
    return `${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  }
  
  if (diffInDays < 30) {
    const weeks = Math.round(diffInDays / 7)
    return `~ ${weeks} semaine${weeks > 1 ? 's' : ''}`
  }
  
  const months = Math.round((diffInDays / 30) * 2) / 2
  const formattedMonths = months.toString().replace('.', ',')
  return `~ ${formattedMonths} mois`
}

export function sortMissions<T extends { estimated_delivery_date?: string | null; created_at: string }>(
  missions: T[]
): T[] {
  return [...missions].sort((a, b) => {
    // 1. Sort by Estimated Delivery Date (Ascending - soonest first)
    if (a.estimated_delivery_date && b.estimated_delivery_date) {
      if (a.estimated_delivery_date !== b.estimated_delivery_date) {
        return a.estimated_delivery_date.localeCompare(b.estimated_delivery_date)
      }
    } else if (a.estimated_delivery_date) {
      return -1 // a has a date, b doesn't -> a comes first
    } else if (b.estimated_delivery_date) {
      return 1 // b has a date, a doesn't -> b comes first
    }

    // 2. Sort by Creation Date (Descending - newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

