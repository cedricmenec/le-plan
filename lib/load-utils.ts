import { differenceInDays, parseISO } from 'date-fns'

export type ROMSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export const ROM_MAPPING: Record<ROMSize, number> = {
  XS: 0.5,
  S: 2,
  M: 5,
  L: 15,
  XL: 45,
  XXL: 100,
}

export function romToDays(size: ROMSize): number {
  return ROM_MAPPING[size] || 0
}

interface TaskWithEstimation {
  status: string
  estimation: number
}

export function calculateTaskRemainingLoad(tasks: TaskWithEstimation[]): number {
  return tasks
    .filter(task => task.status !== 'done')
    .reduce((sum, task) => sum + (Number(task.estimation) || 0), 0)
}

export function calculateTotalLoad(tasks: TaskWithEstimation[]): number {
  return tasks.reduce((sum, task) => sum + (Number(task.estimation) || 0), 0)
}

export function calculateMissionDuration(startedAt: string | null | undefined, completedAt: string | null | undefined): string {
  if (!startedAt || !completedAt) return 'n/a'
  
  try {
    const start = parseISO(startedAt)
    const end = parseISO(completedAt)
    const diff = differenceInDays(end, start)
    
    if (diff < 0) return '0 days'
    return `${diff} days`
  } catch (_e) {
    return 'n/a'
  }
}
