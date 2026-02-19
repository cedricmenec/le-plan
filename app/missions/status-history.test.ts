import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMission, updateMission, reopenMission } from './actions';
import { prisma } from '@/lib/prisma';
import { MissionState, MissionReason } from '@prisma/client';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    missions: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    mission_status_history: {
      create: vi.fn(),
    },
    $transaction: vi.fn(async (arg) => {
      if (typeof arg === 'function') {
        return arg(prisma);
      }
      return Promise.all(arg);
    }),
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-1' } } })),
    },
  })),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Mission Status History Logging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a status history record when a mission is created', async () => {
    const missionData = { title: 'New Mission', type: 'feat', state: MissionState.Backlog };
    (prisma.missions.create as any).mockResolvedValue({ id: 'm1', ...missionData });

    await createMission(missionData);

    expect(prisma.mission_status_history.create).toHaveBeenCalledWith({
      data: {
        mission_id: 'm1',
        status: MissionState.Backlog,
        reason: null,
      },
    });
  });

  it('should create a status history record when a mission status is updated', async () => {
    const missionId = 'm1';
    const updates = { state: MissionState.Active };
    (prisma.missions.findUnique as any).mockResolvedValue({ id: missionId, state: MissionState.Backlog, reason: null });
    (prisma.missions.update as any).mockResolvedValue({ id: missionId, ...updates });

    await updateMission(missionId, updates);

    expect(prisma.mission_status_history.create).toHaveBeenCalledWith({
      data: {
        mission_id: missionId,
        status: MissionState.Active,
        reason: undefined,
      },
    });
  });

  it('should capture reason in history when updating status', async () => {
    const missionId = 'm1';
    const updates = { state: MissionState.Suspended, reason: MissionReason.Blocked };
    (prisma.missions.findUnique as any).mockResolvedValue({ id: missionId, state: MissionState.Active, reason: null });
    (prisma.missions.update as any).mockResolvedValue({ id: missionId, ...updates });

    await updateMission(missionId, updates);

    expect(prisma.mission_status_history.create).toHaveBeenCalledWith({
      data: {
        mission_id: missionId,
        status: MissionState.Suspended,
        reason: MissionReason.Blocked,
      },
    });
  });

  it('should create a status history record when a mission is reopened', async () => {
    const missionId = 'm1';
    (prisma.missions.findUnique as any).mockResolvedValue({ 
      id: missionId, 
      state: MissionState.Terminated, 
      reason: MissionReason.Done 
    });
    (prisma.missions.update as any).mockResolvedValue({ 
      id: missionId, 
      state: MissionState.Queued,
      reason: null
    });

    await reopenMission(missionId);

    expect(prisma.mission_status_history.create).toHaveBeenCalledWith({
      data: {
        mission_id: missionId,
        status: MissionState.Queued,
        reason: null,
      },
    });
  });
});
