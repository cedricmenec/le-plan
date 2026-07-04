import {
  getProjects as dbGetProjects,
  getProject as dbGetProject,
  createProject as dbCreateProject,
  updateProject as dbUpdateProject,
  deleteProject as dbDeleteProject,
  getMissions,
  getSubtasks,
  getStatusHistory,
  type Project,
  type Mission,
} from '@/lib/db';
import { MissionState, MissionReason } from '@/lib/types';

// ─── Serialize helpers (data from IndexedDB is already plain objects) ───

function attachRelations(project: Project, missions: Mission[]) {
  return { ...project, missions };
}

export async function getProjects() {
  const projects = await dbGetProjects();
  const allMissions = await getMissions(null);
  return projects.map(p => ({
    ...p,
    missions: allMissions.filter(m => m.project_id === p.id),
  }));
}

export async function getProject(id: string) {
  const project = await dbGetProject(id);
  if (!project) throw new Error('Project not found');
  const missions = await getMissions(id);
  // Attach subtasks + status_history to each mission
  const missionsWithRelations = await Promise.all(
    missions.map(async (m) => ({
      ...m,
      projects: { name: project.name },
      subtasks: await getSubtasks(m.id),
      status_history: await getStatusHistory(m.id),
    }))
  );
  return { ...project, missions: missionsWithRelations };
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  return dbCreateProject(project);
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) {
  await dbUpdateProject(id, updates);
  return dbGetProject(id);
}

export async function deleteProject(id: string) {
  const missions = await getMissions(id);
  if (missions.length > 0) {
    throw new Error('Cannot delete project with attached missions');
  }
  await dbDeleteProject(id);
}

export async function getRecentlyCompletedMissions(projectId: string, _days: number) {
  const missions = await getMissions(projectId);
  const completed = missions.filter(m => m.state === 'Terminated' && m.reason === 'Done');
  return Promise.all(completed.map(async (m) => ({
    ...m,
    subtasks: await getSubtasks(m.id),
    status_history: await getStatusHistory(m.id),
  })));
}