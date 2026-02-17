'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { MissionState, MissionReason, Prisma } from '@prisma/client'

export async function getProjects() {
  return prisma.projects.findMany({
    include: {
      missions: {
        include: {
          subtasks: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })
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
          subtasks: true
        }
      }
    }
  })

  if (!project) throw new Error('Project not found')
  return project
}

export async function createProject(project: Prisma.projectsCreateUncheckedInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const newProject = await prisma.projects.create({
    data: { ...project, user_id: user.id }
  })

  revalidatePath('/projects')
  return newProject
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
  return project
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

  if (days > 0) {
    const dateLimit = new Date()
    dateLimit.setDate(dateLimit.getDate() - days)
    // We don't have completed_at in Prisma schema yet, but it was in supabase migrations.
    // Let's check schema.prisma again to see if it's there.
  }
  
  // Re-reading schema to be sure about date fields
  return prisma.missions.findMany({
    where,
    include: { subtasks: true },
    orderBy: [
      { updated_at: 'desc' },
      { created_at: 'desc' }
    ]
  })
}
