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

