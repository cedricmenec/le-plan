'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { MissionState, MissionReason, Prisma } from '@prisma/client'

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

function serializeProject(project: any) {
  if (!project) return project
  return {
    ...project,
    created_at: project.created_at?.toISOString(),
    updated_at: project.updated_at?.toISOString(),
    missions: project.missions?.map(serializeMission)
  }
}

export async function getProjects() {
  const projects = await prisma.projects.findMany({
    include: {
      missions: {
        include: {
          subtasks: true,
          status_history: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })
  return projects.map(serializeProject)
}

export async function getProject(id: string) {
  const project = await prisma.projects.findUnique({
    where: { id },
    include: {
      missions: {
        include: {
          projects: {
            select: { name: true }
          },
          subtasks: true,
          status_history: {
            orderBy: { created_at: 'asc' }
          }
        }
      }
    }
  })

  if (!project) throw new Error('Project not found')
  return serializeProject(project)
}

export async function createProject(project: Prisma.projectsCreateUncheckedInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const newProject = await prisma.projects.create({
    data: { ...project, user_id: user.id }
  })

  revalidatePath('/projects')
  return serializeProject(newProject)
}

export async function updateProject(id: string, updates: Prisma.projectsUpdateInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const project = await prisma.projects.update({
    where: { id },
    data: updates
  })

  revalidatePath('/projects')
  return serializeProject(project)
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check for missions first
  const missionCount = await prisma.missions.count({
    where: { project_id: id }
  })
    
  if (missionCount > 0) {
    throw new Error('Cannot delete project with attached missions')
  }

  await prisma.projects.delete({
    where: { id }
  })

  revalidatePath('/projects')
}

export async function getRecentlyCompletedMissions(projectId: string, days: number) {
  const where: Prisma.missionsWhereInput = {
    project_id: projectId,
    state: MissionState.Terminated,
    reason: MissionReason.Done
  }

  const missions = await prisma.missions.findMany({
    where,
    include: { 
      subtasks: true,
      status_history: {
        orderBy: { created_at: 'asc' }
      }
    },
    orderBy: [
      { updated_at: 'desc' },
      { created_at: 'desc' }
    ]
  })
  return missions.map(serializeMission)
}
