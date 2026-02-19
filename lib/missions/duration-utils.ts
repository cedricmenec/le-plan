import { MissionState, MissionReason } from '@prisma/client';

export interface StatusHistoryEntry {
  status: MissionState;
  reason?: MissionReason | null;
  created_at: Date;
}

export interface MissionDurations {
  totalLeadTimeMs: number;
  activeTimeMs: number;
  pausedTimeMs: number;
  blockedTimeMs: number;
  queuedTimeMs: number;
  backlogTimeMs: number;
}

/**
 * Calculates durations spent in various states based on mission status history.
 * Lead time is calculated from the first time the mission enters 'Active' state until 'Terminated'.
 * If not 'Terminated', it calculates up to the provided 'now' date.
 */
export function calculateMissionDurations(
  history: StatusHistoryEntry[],
  now: Date = new Date()
): MissionDurations {
  const durations: MissionDurations = {
    totalLeadTimeMs: 0,
    activeTimeMs: 0,
    pausedTimeMs: 0,
    blockedTimeMs: 0,
    queuedTimeMs: 0,
    backlogTimeMs: 0,
  };

  if (history.length === 0) return durations;

  // Sort history by date just in case
  const sortedHistory = [...history].sort(
    (a, b) => a.created_at.getTime() - b.created_at.getTime()
  );

  const firstActiveIndex = sortedHistory.findIndex(h => h.status === MissionState.Active);
  const firstActiveDate = firstActiveIndex !== -1 ? sortedHistory[firstActiveIndex].created_at : null;

  const terminatedIndex = sortedHistory.findIndex(h => h.status === MissionState.Terminated);
  const endDate = terminatedIndex !== -1 ? sortedHistory[terminatedIndex].created_at : now;

  if (firstActiveDate) {
    durations.totalLeadTimeMs = Math.max(0, endDate.getTime() - firstActiveDate.getTime());
  }

  // Calculate segmented durations by iterating through transitions
  for (let i = 0; i < sortedHistory.length; i++) {
    const current = sortedHistory[i];
    const next = sortedHistory[i + 1];
    const periodEnd = next ? next.created_at : now;
    const duration = Math.max(0, periodEnd.getTime() - current.created_at.getTime());

    switch (current.status) {
      case MissionState.Active:
        durations.activeTimeMs += duration;
        break;
      case MissionState.Suspended:
        if (current.reason === MissionReason.Blocked) {
          durations.blockedTimeMs += duration;
        } else {
          durations.pausedTimeMs += duration;
        }
        break;
      case MissionState.Queued:
        durations.queuedTimeMs += duration;
        break;
      case MissionState.Backlog:
        durations.backlogTimeMs += duration;
        break;
      case MissionState.Terminated:
        // No duration added for Terminated state itself
        break;
    }
  }

  return durations;
}
