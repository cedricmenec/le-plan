'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { MissionStateMachine } from '@/lib/missions/state-machine'
import { MissionState, MissionReason, Prisma } from '@prisma/client'

export type Mission = Prisma.missionsGetPayload<{
  include: { projects: true; subtasks: true }
}>

export async function getMission(id: string) {
  const mission = await prisma.missions.findUnique({
    where: { id },
    include: {
      projects: {
        select: { name: true }
      },
      subtasks: true
    }
  })

  if (!mission) throw new Error('Mission not found')
  return mission
}

export async function createMission(data: {
  title: string
  type: string
  project_id?: string
  priority?: string
  goal?: string
  notes?: string
  estimation?: number
  confidence?: number
  rom_size?: string
  load_source?: string
  state?: MissionState
  reason?: MissionReason | null
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const missionState = data.state || MissionState.Backlog
  const missionReason = data.reason || null

  if (!MissionStateMachine.validateStateAndReason(missionState, missionReason)) {
    throw new Error(`Invalid reason ${missionReason} for state ${missionState}`)
  }

  const mission = await prisma.missions.create({
    data: {
      ...data,
      user_id: user.id,
      state: missionState,
      reason: missionReason,
      // Temporarily mapping state to status for backward compatibility in UI
      status: missionState === MissionState.Terminated && missionReason === MissionReason.Done ? 'done' : 
              missionState === MissionState.Active ? 'in_progress' : 'todo'
    }
  })

  revalidatePath('/')
  revalidatePath('/projects')
  if (mission.project_id) {
    revalidatePath(`/projects/${mission.project_id}`)
  }
  return mission
}

export async function updateMission(id: string, updates: {
  title?: string
  type?: string
  project_id?: string | null
  priority?: string
  goal?: string | null
  notes?: string | null
  estimation?: number
  confidence?: number | null
  rom_size?: string | null
  load_source?: string
  state?: MissionState
  reason?: MissionReason | null
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const currentMission = await prisma.missions.findUnique({
    where: { id },
    select: { state: true, reason: true, project_id: true }
  })

  if (!currentMission) throw new Error('Mission not found')

  const finalUpdates: any = { ...updates }

  if (updates.state) {
    if (!MissionStateMachine.isValidTransition(currentMission.state, updates.state)) {
      throw new Error(`Invalid transition from ${currentMission.state} to ${updates.state}`)
    }

    const nextReason = updates.hasOwnProperty('reason') ? updates.reason : currentMission.reason
    if (!MissionStateMachine.validateStateAndReason(updates.state, nextReason as MissionReason | null)) {
      throw new Error(`Invalid reason ${nextReason} for state ${updates.state}`)
    }

    // Mapping state to legacy status for UI
    finalUpdates.status = updates.state === MissionState.Terminated && nextReason === MissionReason.Done ? 'done' : 
                          updates.state === MissionState.Active ? 'in_progress' : 'todo'
  }

  const mission = await prisma.missions.update({
    where: { id },
    data: finalUpdates
  })

  revalidatePath(`/missions/${id}`)
  revalidatePath('/')
  revalidatePath('/projects')
  if (mission.project_id) {
    revalidatePath(`/projects/${mission.project_id}`)
  }
  if (currentMission.project_id && currentMission.project_id !== mission.project_id) {
    revalidatePath(`/projects/${currentMission.project_id}`)
  }
  return mission
}

export async function updateTask(id: string, updates: Prisma.subtasksUpdateInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const task = await prisma.subtasks.update({
    where: { id },
    data: updates
  })

  if (task.mission_id) {
    revalidatePath(`/missions/${task.mission_id}`)
  }

  return task
}

export async function createTask(task: Prisma.subtasksCreateUncheckedInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const newTask = await prisma.subtasks.create({
    data: task
  })
  
  revalidatePath(`/missions/${newTask.mission_id}`)
  return newTask
}

export async function deleteTask(missionId: string, id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await prisma.subtasks.delete({
    where: { id }
  })
  
  revalidatePath(`/missions/${missionId}`)
}

export async function reorderTasks(missionId: string, tasks: { id: string, position: number }[]) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Using a transaction for bulk update
  await prisma.$transaction(
    tasks.map(task => 
      prisma.subtasks.update({
        where: { id: task.id },
        data: { position: task.position }
      })
    )
  )

  revalidatePath(`/missions/${missionId}`)
}

export async function getMilestoneTypes() {
  return prisma.milestone_types.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function getMilestones(missionId: string) {
  return prisma.milestones.findMany({
    where: { mission_id: missionId },
    include: { milestone_types: true },
    orderBy: { date: 'asc' }
  })
}

export async function createMilestone(missionId: string, milestone: Prisma.milestonesCreateUncheckedInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const newMilestone = await prisma.milestones.create({
    data: { ...milestone, mission_id: missionId }
  })
  
  revalidatePath(`/missions/${missionId}`)
  return newMilestone
}

export async function updateMilestone(missionId: string, id: string, updates: Prisma.milestonesUpdateInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const milestone = await prisma.milestones.update({
    where: { id },
    data: updates
  })
  
  revalidatePath(`/missions/${missionId}`)
  return milestone
}

export async function deleteMilestone(missionId: string, id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await prisma.milestones.delete({
    where: { id }
  })
  
  revalidatePath(`/missions/${missionId}`)
}

export async function deleteMission(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const mission = await prisma.missions.findUnique({
    where: { id },
    select: { project_id: true }
  })

  await prisma.missions.delete({
    where: { id }
  })
  
  revalidatePath('/')
  revalidatePath('/projects')
  if (mission?.project_id) {
    revalidatePath(`/projects/${mission.project_id}`)
  }
}

