import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProjects, getProject, createProject, updateProject, deleteProject } from './actions';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    projects: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    missions: {
      count: vi.fn(),
    }
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

describe('Project Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProjects fetches projects with missions', async () => {
    (prisma.projects.findMany as any).mockResolvedValue([]);
    await getProjects();
    expect(prisma.projects.findMany).toHaveBeenCalledWith(expect.objectContaining({
      include: {
        missions: {
          include: {
            subtasks: true,
            status_history: true
          }
        }
      },
      orderBy: { name: 'asc' }
    }));
  });

  it('getProject fetches a project by id', async () => {
    const mockProj = { id: '1', name: 'Test' };
    (prisma.projects.findUnique as any).mockResolvedValue(mockProj);
    const result = await getProject('1');
    expect(result).toMatchObject(mockProj);
    expect(prisma.projects.findUnique).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: '1' }
    }));
  });

  it('deleteProject throws error if missions exist', async () => {
    (prisma.missions.count as any).mockResolvedValue(5);
    await expect(deleteProject('1')).rejects.toThrow('Cannot delete project with attached missions');
  });
});
