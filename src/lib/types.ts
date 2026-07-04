// Local type definitions replacing @prisma/client imports
// Using plain string unions (not `export type`) to avoid tree-shaking issues in Turbopack

export const MissionState = {
  Backlog: 'Backlog',
  Queued: 'Queued',
  Active: 'Active',
  Suspended: 'Suspended',
  Terminated: 'Terminated',
} as const;

export type MissionState = (typeof MissionState)[keyof typeof MissionState];

export const MissionReason = {
  Done: 'Done',
  Cancelled: 'Cancelled',
  Blocked: 'Blocked',
  Deprioritized: 'Deprioritized',
} as const;

export type MissionReason = (typeof MissionReason)[keyof typeof MissionReason];