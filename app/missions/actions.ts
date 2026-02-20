'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { MissionStateMachine } from '@/lib/missions/state-machine'
import { MissionState, MissionReason, Prisma } from '@prisma/client'

// Helper to serialize Prisma objects for Client Components
function serializeMission(mission: any) {
  if (!mission) return mission
  return {
    ...mission,
    estimation: mission.estimation ? Number(mission.estimation) : 0,
    confidence: mission.confidence ? Number(mission.confidence) : null,
    created_at: mission.created_at?.toISOString(),
    updated_at: mission.updated_at?.toISOString(),
    estimated_delivery_date: mission.estimated_delivery_date?.toISOString(),
    desired_delivery_date: mission.desired_delivery_date?.toISOString(),
    subtasks: mission.subtasks?.map((s: any) => ({
      ...s,
      estimation: s.estimation ? Number(s.estimation) : 0,
      created_at: s.created_at?.toISOString(),
      updated_at: s.updated_at?.toISOString(),
    })),
    status_history: mission.status_history?.map((h: any) => ({
      ...h,
      created_at: h.created_at?.toISOString(),
    }))
  }
}

export type Mission = any // Simplified for now to avoid Decimal issues in types

export async function getMission(id: string) {
  const mission = await prisma.missions.findUnique({
    where: { id },
    include: {
      projects: {
        select: { name: true }
      },
      subtasks: {
        orderBy: { position: 'asc' }
      },
      status_history: {
        orderBy: { created_at: 'asc' }
      }
    }
  })

  if (!mission) throw new Error('Mission not found')
  return serializeMission(mission)
}

export async function createMission(data: any) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const missionState = data.state || MissionState.Backlog
  const missionReason = data.reason || null

  if (!MissionStateMachine.validateStateAndReason(missionState, missionReason)) {
    throw new Error(`Invalid reason ${missionReason} for state ${missionState}`)
  }

  const mission = await prisma.$transaction(async (tx) => {
    const newMission = await tx.missions.create({
      data: {
        ...data,
        user_id: user.id,
        state: missionState,
        reason: missionReason,
      }
    })

    await tx.mission_status_history.create({
      data: {
        mission_id: newMission.id,
        status: missionState,
        reason: missionReason,
      }
    })

    return newMission
  })

  revalidatePath('/')
  revalidatePath('/projects')
  if (mission.project_id) {
    revalidatePath(`/projects/${mission.project_id}`)
  }
  return serializeMission(mission)
}

export async function updateMission(id: string, updates: any) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const currentMission = await prisma.missions.findUnique({
    where: { id },
    select: { state: true, reason: true, project_id: true }
  })

  if (!currentMission) throw new Error('Mission not found')

  const finalUpdates: any = { ...updates }
  
  if (finalUpdates.state) {
    if (!MissionStateMachine.isValidTransition(currentMission.state, finalUpdates.state)) {
      throw new Error(`Invalid transition from ${currentMission.state} to ${finalUpdates.state}`)
    }

    const nextReason = finalUpdates.hasOwnProperty('reason') ? finalUpdates.reason : currentMission.reason
    if (!MissionStateMachine.validateStateAndReason(finalUpdates.state, nextReason as MissionReason | null)) {
      throw new Error(`Invalid reason ${nextReason} for state ${finalUpdates.state}`)
    }
  }

  const mission = await prisma.$transaction(async (tx) => {
    const updatedMission = await tx.missions.update({
      where: { id },
      data: finalUpdates
    })

    if (finalUpdates.state) {
      await tx.mission_status_history.create({
        data: {
          mission_id: id,
          status: updatedMission.state,
          reason: updatedMission.reason,
        }
      })
    }

    return updatedMission
  })

  revalidatePath(`/missions/${id}`)
  revalidatePath('/')
  revalidatePath('/projects')
  if (mission.project_id) {
    revalidatePath(`/projects/${mission.project_id}`)
  }
  return serializeMission(mission)
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

export async function reopenMission(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const currentMission = await prisma.missions.findUnique({
    where: { id },
    select: { state: true, project_id: true }
  })

  if (!currentMission) throw new Error('Mission not found')

  if (currentMission.state !== MissionState.Terminated) {
    throw new Error('Mission can only be re-opened from Terminated state')
  }

  const mission = await prisma.$transaction(async (tx) => {
    const updatedMission = await tx.missions.update({
      where: { id },
      data: {
        state: MissionState.Queued,
        reason: null
      }
    })

    await tx.mission_status_history.create({
      data: {
        mission_id: id,
        status: MissionState.Queued,
        reason: null
      }
    })

    return updatedMission
  })

  revalidatePath(`/missions/${id}`)
  revalidatePath('/')
  revalidatePath('/projects')
  if (mission.project_id) {
    revalidatePath(`/projects/${mission.project_id}`)
  }
  return serializeMission(mission)
}

