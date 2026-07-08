import {
  getMission as dbGetMission,
  createMission as dbCreateMission,
  updateMission as dbUpdateMission,
  deleteMission as dbDeleteMission,
  getSubtasks,
  createSubtask as dbCreateSubtask,
  updateSubtask as dbUpdateSubtask,
  deleteSubtask as dbDeleteSubtask,
  reorderSubtasks,
  getMilestones as dbGetMilestones,
  createMilestone as dbCreateMilestone,
  updateMilestone as dbUpdateMilestone,
  deleteMilestone as dbDeleteMilestone,
  getMilestoneTypes,
  getStatusHistory,
  type Mission,
  type Subtask,
  type Milestone,
  getQueuedMissions,
  reorderMissionQueue,
} from '@/lib/db';
import { MissionStateMachine } from '@/lib/missions/state-machine';
import type { MissionState, MissionReason } from '@/lib/types';

export type { Mission }; // Re-export for consumers

// ─── Mission CRUD ──────────────────────────────────────────────────

export async function getMission(id: string) {
  const mission = await dbGetMission(id);
  if (!mission) throw new Error('Mission not found');

  const [subtasks, history] = await Promise.all([
    getSubtasks(id),
    getStatusHistory(id),
  ]);

  return { ...mission, subtasks, status_history: history };
}

export async function createMission(data: any) {
  const missionState: MissionState = data.state || 'Backlog';
  const missionReason: MissionReason = data.reason || null;

  if (!MissionStateMachine.validateStateAndReason(missionState, missionReason)) {
    throw new Error(`Invalid reason ${missionReason} for state ${missionState}`);
  }

  return dbCreateMission({
    title: data.title,
    type: data.type || 'feature',
    estimation: data.estimation ?? 3,
    confidence: data.confidence ?? 3,
    state: missionState,
    reason: missionReason,
    priority: data.priority || null,
    goal: data.goal || null,
    notes: data.notes || null,
    estimated_delivery_date: data.estimated_delivery_date || null,
    desired_delivery_date: data.desired_delivery_date || null,
    project_id: data.project_id || null,
    queue_position: null,
    project_parent: data.project_parent || null,
  });
}

export async function updateMission(id: string, updates: any) {
  const currentMission = await dbGetMission(id);
  if (!currentMission) throw new Error('Mission not found');

  if (updates.state) {
    if (!MissionStateMachine.isValidTransition(currentMission.state, updates.state)) {
      throw new Error(`Invalid transition from ${currentMission.state} to ${updates.state}`);
    }
    const nextReason = 'reason' in updates ? updates.reason : currentMission.reason;
    if (!MissionStateMachine.validateStateAndReason(updates.state, nextReason as MissionReason)) {
      throw new Error(`Invalid reason ${nextReason} for state ${updates.state}`);
    }
  }

  await dbUpdateMission(id, updates);
  return dbGetMission(id);
}

// ─── Subtask CRUD ─────────────────────────────────────────────────

export async function createTask(task: { mission_id: string; title: string; position?: number; is_completed?: boolean; estimation?: number }) {
  const id = await dbCreateSubtask({
    mission_id: task.mission_id,
    title: task.title,
    is_completed: task.is_completed ?? false,
    position: task.position ?? 0,
    estimation: task.estimation ?? 0.5,
    status: 'todo',
  });
  const subtasks = await getSubtasks(task.mission_id);
  return subtasks.find(s => s.id === id);
}

export async function updateTask(id: string, updates: Partial<Omit<Subtask, 'id' | 'created_at' | 'updated_at'>>) {
  await dbUpdateSubtask(id, updates);
}

export async function deleteTask(_missionId: string, id: string) {
  await dbDeleteSubtask(id);
}

export async function reorderTasks(missionId: string, tasks: { id: string; position: number }[]) {
  const orderedIds = tasks.sort((a, b) => a.position - b.position).map(t => t.id);
  await reorderSubtasks(missionId, orderedIds);
}

// ─── Milestone CRUD ────────────────────────────────────────────────

export { getMilestoneTypes };

export async function getMilestones(missionId: string) {
  const [milestones, types] = await Promise.all([
    dbGetMilestones(missionId),
    getMilestoneTypes(),
  ]);
  return milestones.map(m => ({
    ...m,
    milestone_types: types.find(t => t.id === m.type_id) || null,
  }));
}

export async function createMilestone(missionId: string, milestone: Omit<Milestone, 'id' | 'mission_id' | 'created_at'>) {
  return dbCreateMilestone({ ...milestone, mission_id: missionId });
}

export async function updateMilestone(_missionId: string, id: string, updates: Partial<Omit<Milestone, 'id' | 'mission_id' | 'created_at'>>) {
  await dbUpdateMilestone(id, updates);
}

export async function deleteMilestone(_missionId: string, id: string) {
  await dbDeleteMilestone(id);
}

export async function deleteMission(id: string) {
  await dbDeleteMission(id);
}

export async function reopenMission(id: string) {
  const mission = await dbGetMission(id);
  if (!mission) throw new Error('Mission not found');
  if (mission.state !== 'Terminated') throw new Error('Mission can only be re-opened from Terminated state');
  await dbUpdateMission(id, { state: 'Queued', reason: null });
  return dbGetMission(id);
}

export async function getMissionQueue(projectId: string | null) {
  return getQueuedMissions(projectId);
}

export async function reorderQueue(projectId: string | null, orderedIds: string[]) {
  await reorderMissionQueue(projectId, orderedIds);
  return getQueuedMissions(projectId);
}
