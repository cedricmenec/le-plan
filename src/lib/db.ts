import Dexie, { type EntityTable } from 'dexie';

// ─── Mission state types ───────────────────────────────────────────

export type MissionState = 'Backlog' | 'Queued' | 'Active' | 'Suspended' | 'Terminated';
export type MissionReason = 'Done' | 'Cancelled' | 'Blocked' | 'Deprioritized' | null;
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export function migrateConfidence(percentage: number): ConfidenceLevel {
  const value = Math.max(0, Math.min(100, Number(percentage) || 0));
  return Math.max(1, Math.min(5, Math.ceil(value / 20))) as ConfidenceLevel;
}

// ─── Entity interfaces ─────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  label: string | null;
  description: string | null;
  color: string;
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  title: string;
  type: string;
  estimation: number;
  confidence: ConfidenceLevel | null;
  state: MissionState;
  reason: MissionReason;
  priority: string | null;
  goal: string | null;
  notes: string | null;
  estimated_delivery_date: string | null;
  desired_delivery_date: string | null;
  project_id: string | null;
  project_parent: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  mission_id: string;
  title: string;
  is_completed: boolean;
  position: number;
  estimation: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  mission_id: string;
  type_id: string;
  title: string;
  date: string;
  note: string | null;
  created_at: string;
}

export interface MilestoneType {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface StatusHistory {
  id: string;
  mission_id: string;
  status: MissionState;
  reason: MissionReason;
  note: string | null;
  created_at: string;
}

// ─── Dexie database ────────────────────────────────────────────────

class LePlanDB extends Dexie {
  projects!: EntityTable<Project, 'id'>;
  missions!: EntityTable<Mission, 'id'>;
  subtasks!: EntityTable<Subtask, 'id'>;
  milestones!: EntityTable<Milestone, 'id'>;
  milestoneTypes!: EntityTable<MilestoneType, 'id'>;
  statusHistory!: EntityTable<StatusHistory, 'id'>;

  constructor() {
    super('leplan');
    this.version(1).stores({
      projects: 'id, name, status',
      missions: 'id, state, priority, project_id, estimated_delivery_date',
      subtasks: 'id, mission_id, is_completed, position',
      milestones: 'id, mission_id, date',
      milestoneTypes: 'id, name',
      statusHistory: 'id, mission_id, created_at',
    });
    this.version(2).stores({
      projects: 'id, name, status',
      missions: 'id, state, priority, project_id, estimated_delivery_date',
      subtasks: 'id, mission_id, is_completed, position',
      milestones: 'id, mission_id, date',
      milestoneTypes: 'id, name',
      statusHistory: 'id, mission_id, created_at',
    }).upgrade(async transaction => {
      await transaction.table('missions').toCollection().modify(mission => {
        if (mission.confidence != null) mission.confidence = migrateConfidence(mission.confidence);
        delete mission.rom_size;
        delete mission.load_source;
      });
    });
  }
}

export const db = new LePlanDB();

// ─── Helper: generate a UUID-like id ───────────────────────────────

export function generateId(): string {
  return crypto.randomUUID();
}

// ─── Helper: timestamp now ─────────────────────────────────────────

export function nowISO(): string {
  return new Date().toISOString();
}

// ─── Project CRUD ──────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  return db.projects.orderBy('name').toArray();
}

export async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id);
}

export async function createProject(
  data: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
  const id = generateId();
  const now = nowISO();
  await db.projects.add({ id, ...data, created_at: now, updated_at: now });
  return id;
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const project = await db.projects.get(id);
  if (!project) throw new Error(`Project ${id} not found`);
  await db.projects.update(id, { ...data, updated_at: nowISO() });
}

export async function deleteProject(id: string): Promise<void> {
  // Delete all related entities
  const missions = await db.missions.where('project_id').equals(id).toArray();
  for (const mission of missions) {
    await deleteMission(mission.id);
  }
  await db.projects.delete(id);
}

// ─── Mission CRUD ──────────────────────────────────────────────────

export async function getMissions(projectId?: string | null): Promise<Mission[]> {
  if (projectId) {
    return db.missions.where('project_id').equals(projectId).toArray();
  }
  return db.missions.toArray();
}

export async function getMission(id: string): Promise<Mission | undefined> {
  return db.missions.get(id);
}

export async function createMission(
  data: Omit<Mission, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
  const id = generateId();
  const now = nowISO();
  await db.missions.add({ id, ...data, created_at: now, updated_at: now });
  return id;
}

export async function updateMission(
  id: string,
  data: Partial<Omit<Mission, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const mission = await db.missions.get(id);
  if (!mission) throw new Error(`Mission ${id} not found`);

  // Track state transitions
  if (data.state && data.state !== mission.state) {
    await db.statusHistory.add({
      id: generateId(),
      mission_id: id,
      status: data.state,
      reason: data.reason ?? null,
      note: null,
      created_at: nowISO(),
    });
  }

  await db.missions.update(id, { ...data, updated_at: nowISO() });
}

export async function deleteMission(id: string): Promise<void> {
  await db.subtasks.where('mission_id').equals(id).delete();
  await db.milestones.where('mission_id').equals(id).delete();
  await db.statusHistory.where('mission_id').equals(id).delete();
  await db.missions.delete(id);
}

// ─── Subtask CRUD ──────────────────────────────────────────────────

export async function getSubtasks(missionId: string): Promise<Subtask[]> {
  return db.subtasks.where('mission_id').equals(missionId).sortBy('position');
}

export async function createSubtask(
  data: Omit<Subtask, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
  const id = generateId();
  const now = nowISO();
  await db.subtasks.add({ id, ...data, created_at: now, updated_at: now });
  return id;
}

export async function updateSubtask(
  id: string,
  data: Partial<Omit<Subtask, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  await db.subtasks.update(id, { ...data, updated_at: nowISO() });
}

export async function deleteSubtask(id: string): Promise<void> {
  await db.subtasks.delete(id);
}

export async function reorderSubtasks(
  missionId: string,
  orderedIds: string[]
): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await db.subtasks.update(orderedIds[i], { position: i, updated_at: nowISO() });
  }
}

// ─── Milestone CRUD ────────────────────────────────────────────────

export async function getMilestones(missionId: string): Promise<Milestone[]> {
  return db.milestones.where('mission_id').equals(missionId).sortBy('date');
}

export async function createMilestone(
  data: Omit<Milestone, 'id' | 'created_at'>
): Promise<string> {
  const id = generateId();
  await db.milestones.add({ id, ...data, created_at: nowISO() });
  return id;
}

export async function updateMilestone(
  id: string,
  data: Partial<Omit<Milestone, 'id' | 'created_at'>>
): Promise<void> {
  await db.milestones.update(id, data);
}

export async function deleteMilestone(id: string): Promise<void> {
  await db.milestones.delete(id);
}

// ─── Milestone Type CRUD ───────────────────────────────────────────

export async function getMilestoneTypes(): Promise<MilestoneType[]> {
  return db.milestoneTypes.orderBy('name').toArray();
}

export async function createMilestoneType(
  data: Omit<MilestoneType, 'id' | 'created_at'>
): Promise<string> {
  const id = generateId();
  await db.milestoneTypes.add({ id, ...data, created_at: nowISO() });
  return id;
}

// ─── Status History CRUD ───────────────────────────────────────────

export async function getStatusHistory(missionId: string): Promise<StatusHistory[]> {
  return db.statusHistory
    .where('mission_id')
    .equals(missionId)
    .sortBy('created_at');
}

// ─── Bulk import / export ──────────────────────────────────────────

export interface ExportData {
  version: string;
  exported_at: string;
  projects: Project[];
  missions: Mission[];
  subtasks: Subtask[];
  milestones: Milestone[];
  milestoneTypes: MilestoneType[];
  statusHistory: StatusHistory[];
}

export async function exportAllData(): Promise<ExportData> {
  return {
    version: '1.0',
    exported_at: nowISO(),
    projects: await db.projects.toArray(),
    missions: await db.missions.toArray(),
    subtasks: await db.subtasks.toArray(),
    milestones: await db.milestones.toArray(),
    milestoneTypes: await db.milestoneTypes.toArray(),
    statusHistory: await db.statusHistory.toArray(),
  };
}

export async function importAllData(data: ExportData): Promise<void> {
  await db.projects.bulkPut(data.projects);
  await db.missions.bulkPut(data.missions);
  await db.subtasks.bulkPut(data.subtasks);
  await db.milestones.bulkPut(data.milestones);
  await db.milestoneTypes.bulkPut(data.milestoneTypes);
  await db.statusHistory.bulkPut(data.statusHistory);
}

export async function clearAllData(): Promise<void> {
  await db.projects.clear();
  await db.missions.clear();
  await db.subtasks.clear();
  await db.milestones.clear();
  await db.milestoneTypes.clear();
  await db.statusHistory.clear();
}

// ─── Default milestone types ───────────────────────────────────────

export async function seedDefaultMilestoneTypes(): Promise<void> {
  const existing = await db.milestoneTypes.count();
  if (existing > 0) return;

  const defaults = [
    { name: 'Start', description: 'Début de la mission' },
    { name: 'Decision', description: 'Point de décision' },
    { name: 'Deadline', description: 'Date limite' },
    { name: 'Review', description: 'Revue de la mission' },
    { name: 'Delivery', description: 'Livraison' },
  ];

  for (const mt of defaults) {
    await createMilestoneType(mt);
  }
}
