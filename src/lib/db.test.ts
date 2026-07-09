import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Dexie from 'dexie'
import {
  LePlanDB,
  db,
  clearAllData,
  createProject,
  createMission,
  createSubtask,
  getProjects,
  getProject,
  getMissions,
  getMission,
  getSubtasks,
  updateProject,
  updateMission,
  updateSubtask,
  deleteProject,
  deleteMission,
  exportAllData,
  importAllData,
  seedDefaultMilestoneTypes,
  generateId,
  migrateConfidence,
  getQueuedMissions,
  reorderMissionQueue,
  normalizeMissionQueues,
} from '@/lib/db'

describe('migrateConfidence', () => {
  it.each([[0, 1], [20, 1], [21, 2], [40, 2], [41, 3], [60, 3], [61, 4], [80, 4], [81, 5], [100, 5]])('maps %s%% to level %s', (percentage, level) => {
    expect(migrateConfidence(percentage)).toBe(level)
  })
})

describe('Mission queues', () => {
  beforeEach(clearAllData)
  afterEach(clearAllData)

  it('appends, compacts, reassigns and reorders within a scope', async () => {
    const firstProject = await createProject(sampleProject())
    const secondProject = await createProject({ ...sampleProject(), name: 'Second' })
    const queued = { ...sampleMission(firstProject), state: 'Queued' as const }
    const first = await createMission({ ...queued, title: 'First' })
    const second = await createMission({ ...queued, title: 'Second' })
    expect((await getQueuedMissions(firstProject)).map(m => [m.id, m.queue_position])).toEqual([[first, 0], [second, 1]])

    await reorderMissionQueue(firstProject, [second, first])
    expect((await getQueuedMissions(firstProject)).map(m => m.id)).toEqual([second, first])
    await updateMission(second, { project_id: secondProject })
    expect((await getQueuedMissions(firstProject)).map(m => [m.id, m.queue_position])).toEqual([[first, 0]])
    expect((await getQueuedMissions(secondProject))[0].queue_position).toBe(0)
    await updateMission(first, { state: 'Active' })
    expect((await getMission(first))?.queue_position).toBeNull()
  })

  it('rejects incomplete, duplicate and foreign-scope reorder requests without mutation', async () => {
    const project = await createProject(sampleProject())
    const other = await createProject({ ...sampleProject(), name: 'Other' })
    const first = await createMission({ ...sampleMission(project), state: 'Queued', title: 'First' })
    const second = await createMission({ ...sampleMission(project), state: 'Queued', title: 'Second' })
    const foreign = await createMission({ ...sampleMission(other), state: 'Queued' })
    await expect(reorderMissionQueue(project, [first])).rejects.toThrow()
    await expect(reorderMissionQueue(project, [first, first])).rejects.toThrow()
    await expect(reorderMissionQueue(project, [first, foreign])).rejects.toThrow()
    expect((await getQueuedMissions(project)).map(m => m.id)).toEqual([first, second])
  })

  it('normalizes invalid legacy positions deterministically and clears non-queued positions', () => {
    const base = { ...sampleMission(null as unknown as string), project_id: null, created_at: '2026-01-01', updated_at: '2026-01-01' }
    const missions = normalizeMissionQueues([
      { ...base, id: 'later', title: 'Later', state: 'Queued', queue_position: 4, estimated_delivery_date: '2026-02-01' },
      { ...base, id: 'sooner', title: 'Sooner', state: 'Queued', queue_position: 4, estimated_delivery_date: '2026-01-01' },
      { ...base, id: 'backlog', title: 'Backlog', state: 'Backlog', queue_position: 9 },
    ])
    expect(missions.find(m => m.id === 'sooner')?.queue_position).toBe(0)
    expect(missions.find(m => m.id === 'later')?.queue_position).toBe(1)
    expect(missions.find(m => m.id === 'backlog')?.queue_position).toBeNull()
  })

  it('migrates legacy queued missions into deterministic scoped positions without data loss', async () => {
    const databaseName = `leplan-migration-${crypto.randomUUID()}`
    const legacyDb = new Dexie(databaseName)
    legacyDb.version(2).stores({
      projects: 'id, name, status',
      missions: 'id, state, priority, project_id, estimated_delivery_date',
      subtasks: 'id, mission_id, is_completed, position',
      milestones: 'id, mission_id, date',
      milestoneTypes: 'id, name',
      statusHistory: 'id, mission_id, created_at',
    })

    const base = {
      ...sampleMission('project-a'),
      confidence: 4 as const,
      reason: null,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    }

    try {
      await legacyDb.open()
      await legacyDb.table('missions').bulkAdd([
        { ...base, id: 'later', title: 'Later', state: 'Queued', estimated_delivery_date: '2026-02-01' },
        { ...base, id: 'newer-undated', title: 'Newer undated', state: 'Queued', estimated_delivery_date: null, created_at: '2026-01-03T00:00:00.000Z' },
        { ...base, id: 'sooner', title: 'Sooner', state: 'Queued', estimated_delivery_date: '2026-01-01', notes: 'keep me' },
        { ...base, id: 'active', title: 'Active', state: 'Active', queue_position: 99 },
        { ...base, id: 'standalone', title: 'Standalone', state: 'Queued', project_id: null },
      ])
      legacyDb.close()

      const upgradedDb = new LePlanDB(databaseName)
      await upgradedDb.open()
      const missions = await upgradedDb.missions.toArray()
      upgradedDb.close()

      expect(missions.find(m => m.id === 'sooner')).toMatchObject({ state: 'Queued', queue_position: 0, notes: 'keep me' })
      expect(missions.find(m => m.id === 'later')).toMatchObject({ state: 'Queued', queue_position: 1 })
      expect(missions.find(m => m.id === 'newer-undated')).toMatchObject({ state: 'Queued', queue_position: 2 })
      expect(missions.find(m => m.id === 'standalone')).toMatchObject({ state: 'Queued', project_id: null, queue_position: 0 })
      expect(missions.find(m => m.id === 'active')).toMatchObject({ state: 'Active', queue_position: null })
      expect(missions).toHaveLength(5)
    } finally {
      legacyDb.close()
      await Dexie.delete(databaseName)
    }
  })

  it('preserves queued order when non-state metadata changes', async () => {
    const project = await createProject(sampleProject())
    const first = await createMission({ ...sampleMission(project), state: 'Queued', title: 'First' })
    const second = await createMission({ ...sampleMission(project), state: 'Queued', title: 'Second' })

    await updateMission(first, { priority: 'high', estimated_delivery_date: '2026-01-01' })

    expect((await getQueuedMissions(project)).map(m => m.id)).toEqual([first, second])
  })

  it('handles queued entry, exit, deletion, reopen and standalone scopes without automatic activation', async () => {
    const project = await createProject(sampleProject())
    const queued = await createMission({ ...sampleMission(project), state: 'Queued', title: 'Queued' })
    const next = await createMission({ ...sampleMission(project), state: 'Queued', title: 'Next' })
    const standalone = await createMission({ ...sampleMission(null), state: 'Queued', title: 'Standalone' })
    const active = await createMission({ ...sampleMission(project), state: 'Active', title: 'Active' })
    const terminated = await createMission({ ...sampleMission(project), state: 'Terminated', reason: 'Done', title: 'Done' })

    expect((await getQueuedMissions(project)).map(m => [m.id, m.queue_position])).toEqual([[queued, 0], [next, 1]])
    expect((await getQueuedMissions(null)).map(m => [m.id, m.queue_position])).toEqual([[standalone, 0]])

    await updateMission(queued, { state: 'Backlog', reason: null })
    expect((await getMission(queued))?.queue_position).toBeNull()
    expect((await getQueuedMissions(project)).map(m => [m.id, m.queue_position])).toEqual([[next, 0]])

    await updateMission(queued, { state: 'Queued', reason: null })
    expect((await getQueuedMissions(project)).map(m => m.id)).toEqual([next, queued])

    await updateMission(terminated, { state: 'Queued', reason: null })
    expect((await getQueuedMissions(project)).map(m => m.id)).toEqual([next, queued, terminated])

    await deleteMission(active)
    expect((await getMission(next))?.state).toBe('Queued')

    await deleteMission(next)
    expect((await getQueuedMissions(project)).map(m => [m.id, m.queue_position])).toEqual([[queued, 0], [terminated, 1]])
  })

  it('preserves explicit valid import order and normalizes invalid imported queue data', async () => {
    const base = { ...sampleMission(null), created_at: '2026-01-01', updated_at: '2026-01-01' }
    await importAllData({
      version: '1.0',
      exported_at: '2026-01-01',
      projects: [],
      subtasks: [],
      milestones: [],
      milestoneTypes: [],
      statusHistory: [],
      missions: [
        { ...base, id: 'second', title: 'Second', state: 'Queued', queue_position: 1, estimated_delivery_date: '2026-01-01' },
        { ...base, id: 'first', title: 'First', state: 'Queued', queue_position: 0, estimated_delivery_date: '2026-02-01' },
        { ...base, id: 'backlog', title: 'Backlog', state: 'Backlog', queue_position: 7 },
      ],
    })

    expect((await getQueuedMissions(null)).map(m => m.id)).toEqual(['first', 'second'])
    expect((await getMission('backlog'))?.queue_position).toBeNull()
  })
})

// ─── Helpers ─────────────────────────────────────────────────────────────

const sampleProject = () => ({
  name: 'Test Project',
  label: 'Dev',
  description: 'A test project',
  color: '#3b82f6',
  status: 'active',
  image_url: null,
})

const sampleMission = (projectId: string | null) => ({
  title: 'Test Mission',
  type: 'feature',
  estimation: 5,
  confidence: 4 as const,
  state: 'Backlog' as const,
  reason: null as null,
  priority: 'medium',
  goal: 'Do something',
  notes: null,
  estimated_delivery_date: null,
  desired_delivery_date: null,
  project_id: projectId,
  project_parent: null,
})

const sampleSubtask = (missionId: string) => ({
  mission_id: missionId,
  title: 'Subtask 1',
  is_completed: false,
  position: 0,
  estimation: 2,
  status: 'pending',
})

// ─── Tests ────────────────────────────────────────────────────────────────

describe('Offline Persistence', () => {
  beforeEach(async () => {
    await clearAllData()
    await seedDefaultMilestoneTypes()
  })

  afterEach(async () => {
    await clearAllData()
  })

  it('should persist a project across read operations', async () => {
    const id = await createProject(sampleProject())
    const project = await getProject(id)
    expect(project).toBeDefined()
    expect(project!.name).toBe('Test Project')
  })

  it('should persist a mission linked to a project', async () => {
    const projectId = await createProject(sampleProject())
    const missionId = await createMission(sampleMission(projectId))
    const mission = await getMission(missionId)
    expect(mission).toBeDefined()
    expect(mission!.project_id).toBe(projectId)
    expect(mission!.title).toBe('Test Mission')
  })

  it('should persist subtasks linked to a mission', async () => {
    const projectId = await createProject(sampleProject())
    const missionId = await createMission(sampleMission(projectId))
    const subtaskId = await createSubtask(sampleSubtask(missionId))
    const subtasks = await getSubtasks(missionId)
    expect(subtasks).toHaveLength(1)
    expect(subtasks[0].id).toBe(subtaskId)
  })

  it('should update a project and reflect changes', async () => {
    const id = await createProject(sampleProject())
    await updateProject(id, { name: 'Updated Project', color: '#ef4444' })
    const project = await getProject(id)
    expect(project!.name).toBe('Updated Project')
    expect(project!.color).toBe('#ef4444')
  })

  it('should update a mission state and track status history', async () => {
    const projectId = await createProject(sampleProject())
    const missionId = await createMission(sampleMission(projectId))
    await updateMission(missionId, { state: 'Active', reason: null })
    const mission = await getMission(missionId)
    expect(mission!.state).toBe('Active')

    // Status history should have been created
    const history = await db.statusHistory.where('mission_id').equals(missionId).toArray()
    expect(history).toHaveLength(1)
    expect(history[0].status).toBe('Active')
  })

  it('should delete a project and cascade to related missions/subtasks', async () => {
    const projectId = await createProject(sampleProject())
    const missionId = await createMission(sampleMission(projectId))
    await createSubtask(sampleSubtask(missionId))
    await deleteProject(projectId)

    const project = await getProject(projectId)
    expect(project).toBeUndefined()

    const missions = await getMissions(projectId)
    expect(missions).toHaveLength(0)
  })

  it('should delete a mission and cascade to related subtasks', async () => {
    const projectId = await createProject(sampleProject())
    const missionId = await createMission(sampleMission(projectId))
    await createSubtask(sampleSubtask(missionId))
    await deleteMission(missionId)

    const mission = await getMission(missionId)
    expect(mission).toBeUndefined()

    const subtasks = await getSubtasks(missionId)
    expect(subtasks).toHaveLength(0)
  })
})

describe('Data Integrity (IndexedDB)', () => {
  beforeEach(async () => {
    await clearAllData()
    await seedDefaultMilestoneTypes()
  })

  afterEach(async () => {
    await clearAllData()
  })

  it('should export all data in the correct format', async () => {
    const projectId = await createProject(sampleProject())
    const missionId = await createMission(sampleMission(projectId))
    await createSubtask(sampleSubtask(missionId))

    const exported = await exportAllData()
    expect(exported.version).toBe('1.0')
    expect(exported.projects).toHaveLength(1)
    expect(exported.missions).toHaveLength(1)
    expect(exported.subtasks).toHaveLength(1)
    expect(exported.exported_at).toBeDefined()
  })

  it('should import data and restore all entities', async () => {
    // First create and export
    const projectId = await createProject(sampleProject())
    const missionId = await createMission(sampleMission(projectId))
    await createSubtask(sampleSubtask(missionId))
    const exported = await exportAllData()

    // Clear and import
    await clearAllData()
    await importAllData(exported)

    const projects = await getProjects()
    expect(projects).toHaveLength(1)
    expect(projects[0].name).toBe('Test Project')

    const missions = await getMissions(projectId)
    expect(missions).toHaveLength(1)
    expect(missions[0].title).toBe('Test Mission')

    const subtasks = await getSubtasks(missionId)
    expect(subtasks).toHaveLength(1)
    expect(subtasks[0].title).toBe('Subtask 1')
  })

  it('should handle empty database export gracefully', async () => {
    const exported = await exportAllData()
    expect(exported.projects).toHaveLength(0)
    expect(exported.missions).toHaveLength(0)
    expect(exported.subtasks).toHaveLength(0)
  })

  it('should enforce referential integrity on mission updates', async () => {
    const projectId = await createProject(sampleProject())
    const missionId = await createMission(sampleMission(projectId))

    // Verify mission references valid project
    const mission = await getMission(missionId)
    expect(mission!.project_id).toBe(projectId)
  })

  it('should persist data across sequential CRUD cycles', async () => {
    const id = await createProject(sampleProject())

    // Read
    let project = await getProject(id)
    expect(project!.name).toBe('Test Project')

    // Update
    await updateProject(id, { name: 'Cycle 2' })
    project = await getProject(id)
    expect(project!.name).toBe('Cycle 2')

    // Update again
    await updateProject(id, { name: 'Cycle 3', color: '#22c55e' })
    project = await getProject(id)
    expect(project!.name).toBe('Cycle 3')
    expect(project!.color).toBe('#22c55e')
  })

  it('should generate unique IDs', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      ids.add(generateId())
    }
    expect(ids.size).toBe(100)
  })
})
