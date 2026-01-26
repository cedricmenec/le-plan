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
