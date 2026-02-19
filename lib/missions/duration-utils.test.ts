import { describe, it, expect } from 'vitest';
import { calculateMissionDurations } from './duration-utils';
import { MissionState, MissionReason } from '@prisma/client';

describe('calculateMissionDurations', () => {
  const now = new Date('2026-02-19T15:00:00Z');

  it('should return 0 durations if history is empty', () => {
    const result = calculateMissionDurations([], now);
    expect(result.totalLeadTimeMs).toBe(0);
    expect(result.activeTimeMs).toBe(0);
  });

  it('should calculate total lead time from first Active state to Terminated', () => {
    const history = [
      { status: MissionState.Backlog, created_at: new Date('2026-02-19T10:00:00Z') },
      { status: MissionState.Queued, created_at: new Date('2026-02-19T11:00:00Z') },
      { status: MissionState.Active, created_at: new Date('2026-02-19T12:00:00Z') }, // Start
      { status: MissionState.Terminated, created_at: new Date('2026-02-19T14:00:00Z') }, // End
    ];

    const result = calculateMissionDurations(history as any, now);
    expect(result.totalLeadTimeMs).toBe(2 * 60 * 60 * 1000); // 2 hours
  });

  it('should calculate durations with Paused and Blocked states', () => {
    const history = [
      { status: MissionState.Active, created_at: new Date('2026-02-19T10:00:00Z') }, // Active starts
      { status: MissionState.Suspended, reason: MissionReason.Blocked, created_at: new Date('2026-02-19T11:00:00Z') }, // Blocked starts (1h Active)
      { status: MissionState.Active, created_at: new Date('2026-02-19T12:00:00Z') }, // Active starts (1h Blocked)
      { status: MissionState.Suspended, reason: MissionReason.Deprioritized, created_at: new Date('2026-02-19T13:00:00Z') }, // Paused starts (1h Active)
      { status: MissionState.Terminated, created_at: new Date('2026-02-19T14:00:00Z') }, // End (1h Paused)
    ];

    const result = calculateMissionDurations(history as any, now);
    expect(result.totalLeadTimeMs).toBe(4 * 60 * 60 * 1000); // 10h to 14h = 4h
    expect(result.activeTimeMs).toBe(2 * 60 * 60 * 1000); // 2h active
    expect(result.blockedTimeMs).toBe(1 * 60 * 60 * 1000); // 1h blocked
    expect(result.pausedTimeMs).toBe(1 * 60 * 60 * 1000); // 1h paused
  });

  it('should calculate current durations if not Terminated', () => {
    const history = [
      { status: MissionState.Active, created_at: new Date('2026-02-19T10:00:00Z') }, // Active starts
    ];
    // current time is 15:00:00Z (5h later)

    const result = calculateMissionDurations(history as any, now);
    expect(result.totalLeadTimeMs).toBe(5 * 60 * 60 * 1000);
    expect(result.activeTimeMs).toBe(5 * 60 * 60 * 1000);
  });
});
