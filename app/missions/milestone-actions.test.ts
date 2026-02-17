import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getMilestoneTypes, 
  getMilestones, 
  createMilestone, 
  updateMilestone, 
  deleteMilestone 
} from './actions';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    milestone_types: {
      findMany: vi.fn(),
    },
    milestones: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'u1' } } })),
    },
  })),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Milestone Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getMilestoneTypes fetches types', async () => {
    (prisma.milestone_types.findMany as any).mockResolvedValue([{ id: 't1', name: 'Type 1' }]);
    const types = await getMilestoneTypes();
    expect(types).toHaveLength(1);
    expect(types[0].name).toBe('Type 1');
  });

  it('createMilestone inserts a milestone', async () => {
    const mockMilestone = { id: 'm1', mission_id: 'mission1', title: 'New' };
    (prisma.milestones.create as any).mockResolvedValue(mockMilestone);
    
    const milestone = await createMilestone('mission1', { 
      title: 'New Milestone', 
      date: new Date('2026-01-25'), 
      type_id: 't1' 
    } as any);
    
    expect(milestone.mission_id).toBe('mission1');
  });

  it('updateMilestone updates a milestone', async () => {
    const mockMilestone = { id: 'm1', mission_id: 'mission1' };
    (prisma.milestones.update as any).mockResolvedValue(mockMilestone);
    
    const milestone = await updateMilestone('mission1', 'm1', { title: 'Updated' });
    expect(milestone.id).toBe('m1');
  });

  it('deleteMilestone deletes a milestone', async () => {
    await deleteMilestone('mission1', 'm1');
    expect(prisma.milestones.delete).toHaveBeenCalledWith({ where: { id: 'm1' } });
  });
});
