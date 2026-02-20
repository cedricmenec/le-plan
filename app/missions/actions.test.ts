import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createMission, 
  updateMission, 
  getMission,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
  getMilestoneTypes,
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  deleteMission,
  reopenMission
} from './actions';
import { prisma } from '@/lib/prisma';
import { MissionStateMachine } from '@/lib/missions/state-machine';
import { MissionState, MissionReason } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    missions: {
      create: vi.fn(async (args) => ({ id: '1', ...args.data })),
      update: vi.fn(async (args) => ({ id: args.where.id, ...args.data })),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    subtasks: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    milestone_types: {
      findMany: vi.fn(),
    },
    milestones: {
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
    mission_status_history: {
      create: vi.fn(async (args) => ({ id: 'h1', ...args.data })),
    },
    $transaction: vi.fn(async (arg) => {
      if (typeof arg === 'function') {
        // Use the global prisma object that we might be spying on
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

describe('Mission Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createMission', () => {
    it('should create a mission in Backlog state by default', async () => {
      const missionData = { title: 'New Mission', type: 'feat' };
      (prisma.missions.create as any).mockResolvedValue({ id: '1', ...missionData, state: MissionState.Backlog });

      await createMission(missionData);

      expect(prisma.missions.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          state: MissionState.Backlog,
        }),
      });
    });

    it('should allow creating a mission in Active state', async () => {
      const missionData = { title: 'New Mission', type: 'feat', state: MissionState.Active };
      (prisma.missions.create as any).mockResolvedValue({ id: '1', ...missionData });

      await createMission(missionData);

      expect(prisma.missions.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          state: MissionState.Active,
        }),
      });
    });

    it('should throw error for invalid state/reason combination', async () => {
      const missionData = { title: 'New Mission', type: 'feat', state: MissionState.Suspended, reason: null };
      
      await expect(createMission(missionData as any)).rejects.toThrow(/Invalid reason/);
    });
  });

  describe('updateMission', () => {
    it('should validate transition and update mission', async () => {
      const missionId = '1';
      const updates = { state: MissionState.Active };
      (prisma.missions.findUnique as any).mockResolvedValue({ id: missionId, state: MissionState.Backlog, reason: null });
      (prisma.missions.update as any).mockResolvedValue({ id: missionId, ...updates });

      await updateMission(missionId, updates);

      expect(prisma.missions.update).toHaveBeenCalledWith({
        where: { id: missionId },
        data: expect.objectContaining({
          state: MissionState.Active,
        }),
      });
    });

    it('should throw error for invalid transition', async () => {
      const missionId = '1';
      const updates = { state: MissionState.Terminated };
      (prisma.missions.findUnique as any).mockResolvedValue({ id: missionId, state: MissionState.Backlog, reason: null });

      await expect(updateMission(missionId, updates)).rejects.toThrow(/Invalid transition/);
    });

    it('should require a reason when moving to Suspended', async () => {
      const missionId = '1';
      const updates = { state: MissionState.Suspended };
      (prisma.missions.findUnique as any).mockResolvedValue({ id: missionId, state: MissionState.Active, reason: null });

      await expect(updateMission(missionId, updates)).rejects.toThrow(/Invalid reason/);
    });

    it('should allow move to Suspended with a reason', async () => {
      const missionId = '1';
      const updates = { state: MissionState.Suspended, reason: MissionReason.Blocked };
      (prisma.missions.findUnique as any).mockResolvedValue({ id: missionId, state: MissionState.Active, reason: null });
      (prisma.missions.update as any).mockResolvedValue({ id: missionId, ...updates });

      await updateMission(missionId, updates);

      expect(prisma.missions.update).toHaveBeenCalledWith({
        where: { id: missionId },
        data: expect.objectContaining({
          state: MissionState.Suspended,
          reason: MissionReason.Blocked,
        }),
      });
    });
  });

  describe('getMission', () => {
    it('should fetch mission with projects and subtasks', async () => {
      const id = '1';
      (prisma.missions.findUnique as any).mockResolvedValue({ id, title: 'Test' });

      const result = await getMission(id);

      expect(result).toMatchObject({ id, title: 'Test', estimation: 0 });
      expect(prisma.missions.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: expect.anything()
      });
    });

    it('should throw if mission not found', async () => {
      (prisma.missions.findUnique as any).mockResolvedValue(null);
      await expect(getMission('invalid')).rejects.toThrow('Mission not found');
    });
  });

  describe('tasks', () => {
    it('should create a task', async () => {
      const taskData = { mission_id: '1', title: 'Task' };
      (prisma.subtasks.create as any).mockResolvedValue({ id: 't1', ...taskData });

      await createTask(taskData as any);

      expect(prisma.subtasks.create).toHaveBeenCalledWith({ data: taskData });
    });

    it('should update a task', async () => {
      const id = 't1';
      const updates = { title: 'Updated' };
      (prisma.subtasks.update as any).mockResolvedValue({ id, mission_id: 'm1', ...updates });

      await updateTask(id, updates);

      expect(prisma.subtasks.update).toHaveBeenCalledWith({ where: { id }, data: updates });
    });

    it('should delete a task', async () => {
      await deleteTask('m1', 't1');
      expect(prisma.subtasks.delete).toHaveBeenCalledWith({ where: { id: 't1' } });
    });

    it('should reorder tasks in a transaction', async () => {
      const tasks = [{ id: '1', position: 1 }, { id: '2', position: 2 }];
      
      await reorderTasks('m1', tasks);

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('milestones', () => {
    it('should fetch milestone types', async () => {
      (prisma.milestone_types.findMany as any).mockResolvedValue([{ id: '1', name: 'Type' }]);
      const result = await getMilestoneTypes();
      expect(result).toHaveLength(1);
    });

    it('should fetch milestones for a mission', async () => {
      (prisma.milestones.findMany as any).mockResolvedValue([]);
      await getMilestones('m1');
      expect(prisma.milestones.findMany).toHaveBeenCalledWith({
        where: { mission_id: 'm1' },
        include: expect.anything(),
        orderBy: expect.anything()
      });
    });

    it('should create, update and delete milestones', async () => {
      (prisma.milestones.create as any).mockResolvedValue({ id: 'mil1' });
      await createMilestone('m1', { title: 'M', date: new Date(), type_id: 't1' } as any);
      expect(prisma.milestones.create).toHaveBeenCalled();

      (prisma.milestones.update as any).mockResolvedValue({ id: 'mil1' });
      await updateMilestone('m1', 'mil1', { title: 'M2' });
      expect(prisma.milestones.update).toHaveBeenCalled();

      await deleteMilestone('m1', 'mil1');
      expect(prisma.milestones.delete).toHaveBeenCalledWith({ where: { id: 'mil1' } });
    });
  });

  describe('deleteMission', () => {
    it('should delete mission and its related project revalidation', async () => {
      (prisma.missions.findUnique as any).mockResolvedValue({ id: '1', project_id: 'p1' });
      await deleteMission('1');
      expect(prisma.missions.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('reopenMission', () => {
    it('should transition mission from Terminated to Queued', async () => {
      const missionId = '1';
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

      const result = await reopenMission(missionId);

      expect(prisma.missions.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: missionId },
        data: expect.objectContaining({
          state: MissionState.Queued,
          reason: null,
        }),
      }));
      expect(result.state).toBe(MissionState.Queued);
    });

    it('should throw if mission is not Terminated', async () => {
      const missionId = '1';
      (prisma.missions.findUnique as any).mockResolvedValue({ 
        id: missionId, 
        state: MissionState.Active, 
        reason: null 
      });

      await expect(reopenMission(missionId)).rejects.toThrow(/only be re-opened from Terminated/);
    });
  });
});
