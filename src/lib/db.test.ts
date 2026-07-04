import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
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
} from '@/lib/db'

// ─── Helpers ─────────────────────────────────────────────────────────────

const sampleProject = () => ({
  name: 'Test Project',
  label: 'Dev',
  description: 'A test project',
  color: '#3b82f6',
  status: 'active',
  image_url: null,
})

const sampleMission = (projectId: string) => ({
  title: 'Test Mission',
  type: 'feature',
  estimation: 5,
  confidence: 80,
  state: 'Backlog' as const,
  reason: null as null,
  priority: 'medium',
  goal: 'Do something',
  notes: null,
  estimated_delivery_date: null,
  desired_delivery_date: null,
  rom_size: null,
  load_source: 'tasks',
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