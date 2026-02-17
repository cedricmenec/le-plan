import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from './prisma';

describe('updated_at behavior', () => {
  let userId: string;

  beforeAll(async () => {
    const user = await prisma.users.findFirst();
    if (!user) throw new Error('No user found in database for testing');
    userId = user.id;
  });

  it('should update updated_at when a Project is updated', async () => {
    // 1. Create a project
    const project = await prisma.projects.create({
      data: {
        name: 'Test Project',
        user_id: userId,
        color: 'blue'
      }
    });

    const initialUpdatedAt = project.updated_at;
    expect(initialUpdatedAt).toBeDefined();

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Update the project
    const updatedProject = await prisma.projects.update({
      where: { id: project.id },
      data: {
        name: 'Updated Project Name'
      }
    });

    expect(updatedProject.updated_at.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());

    // Cleanup
    await prisma.projects.delete({ where: { id: project.id } });
  });

  it('should update updated_at when a Mission is updated', async () => {
    // 1. Create a mission
    const mission = await prisma.missions.create({
      data: {
        title: 'Test Mission',
        user_id: userId,
        type: 'test'
      }
    });

    const initialUpdatedAt = mission.updated_at;
    expect(initialUpdatedAt).toBeDefined();

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Update the mission
    const updatedMission = await prisma.missions.update({
      where: { id: mission.id },
      data: {
        title: 'Updated Mission Title'
      }
    });

    expect(updatedMission.updated_at.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());

    // Cleanup
    await prisma.missions.delete({ where: { id: mission.id } });
  });

  it('should update updated_at when a Subtask is updated', async () => {
    // 1. Create a mission first
    const mission = await prisma.missions.create({
      data: {
        title: 'Parent Mission',
        user_id: userId,
        type: 'test'
      }
    });

    // 2. Create a subtask
    const subtask = await prisma.subtasks.create({
      data: {
        title: 'Test Subtask',
        mission_id: mission.id
      }
    });

    const initialUpdatedAt = subtask.updated_at;
    expect(initialUpdatedAt).toBeDefined();

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Update the subtask
    const updatedSubtask = await prisma.subtasks.update({
      where: { id: subtask.id },
      data: {
        title: 'Updated Subtask Title'
      }
    });

    expect(updatedSubtask.updated_at.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());

    // Cleanup
    await prisma.subtasks.delete({ where: { id: subtask.id } });
    await prisma.missions.delete({ where: { id: mission.id } });
  });
});
