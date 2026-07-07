import { differenceInDays, parseISO } from 'date-fns'

interface TaskWithEstimation {
  is_completed: boolean
  estimation: number
}

export function calculateTaskRemainingLoad(tasks: TaskWithEstimation[]): number {
  return tasks
    .filter(task => !task.is_completed)
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
