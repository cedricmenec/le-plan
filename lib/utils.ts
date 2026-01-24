import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDuration(date: Date | string | null): string {
  if (!date) return 'n/a'
  
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  
  // Set times to midnight for date-only comparison if we want pure days
  // But for simple "days remaining", diff in ms is usually fine
  const diffInMs = targetDate.getTime() - now.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) {
    // Check if it's actually today (same calendar day)
    const isSameDay = targetDate.toDateString() === now.toDateString()
    if (isSameDay) return '0 jours'
    return 'en retard'
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
