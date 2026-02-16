'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database.types'

type Mission = Database['public']['Tables']['missions']['Row']
type InsertMission = Database['public']['Tables']['missions']['Insert']
type UpdateMission = Database['public']['Tables']['missions']['Update']

export async function getMission(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*, projects(name), subtasks(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createMission(mission: Omit<InsertMission, 'id' | 'created_at' | 'user_id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('missions')
    .insert({ ...mission, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  revalidatePath('/')
  revalidatePath('/projects')
  if (data.project_id) {
    revalidatePath(`/projects/${data.project_id}`)
  }
  return data
}

export async function updateMission(id: string, updates: Omit<UpdateMission, 'id' | 'created_at' | 'user_id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get current mission state to check for status transitions
  const { data: currentMission } = await supabase
    .from('missions')
    .select('status, started_at, completed_at')
    .eq('id', id)
    .single()

  const finalUpdates = { ...updates }

  if (updates.status && currentMission) {
    // If transitioning to in_progress and not already started
    if (updates.status === 'in_progress' && !currentMission.started_at) {
      finalUpdates.started_at = new Date().toISOString()
    }
    // If transitioning to done and not already completed
    if (updates.status === 'done' && !currentMission.completed_at) {
      finalUpdates.completed_at = new Date().toISOString()
    }
    // Reset completed_at if moving back from done
    if (currentMission.status === 'done' && updates.status !== 'done') {
      finalUpdates.completed_at = null
    }
  }

  const { data, error } = await supabase
    .from('missions')
    .update(finalUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    // If columns don't exist, try updating without them
    if (error.code === '42703') {
      console.warn('Database columns completed_at/started_at are missing. Updating without them.')
      const { started_at: _s, completed_at: _c, ...safeUpdates } = finalUpdates as UpdateMission
      const { data: retryData, error: retryError } = await supabase
        .from('missions')
        .update(safeUpdates)
        .eq('id', id)
        .select()
        .single()
      
      if (retryError) throw retryError
      return retryData
    }
    throw error
  }
  revalidatePath(`/missions/${id}`)
  revalidatePath('/')
  revalidatePath('/projects')
  if (data.project_id) {
    revalidatePath(`/projects/${data.project_id}`)
  }
  return data
}

export async function updateTask(id: string, updates: Database['public']['Tables']['subtasks']['Update']) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('subtasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  
  if (data.mission_id) {
    revalidatePath(`/missions/${data.mission_id}`)
  }

  return data
}

export async function createTask(task: Omit<Database['public']['Tables']['subtasks']['Insert'], 'id' | 'created_at'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('subtasks')
    .insert(task)
    .select()
    .single()

  if (error) throw error
  
  revalidatePath(`/missions/${data.mission_id}`)
  return data
}

export async function deleteTask(missionId: string, id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('subtasks')
    .delete()
    .eq('id', id)

  if (error) throw error
  
  revalidatePath(`/missions/${missionId}`)
}

export async function reorderTasks(missionId: string, tasks: { id: string, position: number }[]) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Bulk update positions
  // Note: Supabase doesn't have a single call for different updates per row easily without a function
  // But for short lists, we can do multiple updates or a single upsert if we have all data.
  // Using upsert with only id and position might work if other fields are allowed to be missing or have defaults.
  // Better to use a sequence of updates for safety in a transaction if possible, 
  // but here we'll just loop for simplicity as typical subtask lists are small (< 20 items).
  
  for (const task of tasks) {
    const { error } = await supabase
      .from('subtasks')
      .update({ position: task.position })
      .eq('id', task.id)
    
    if (error) throw error
  }

  revalidatePath(`/missions/${missionId}`)
}

export async function getMilestoneTypes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('milestone_types')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

export async function getMilestones(missionId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('milestones')
    .select('*, milestone_types(name)')
    .eq('mission_id', missionId)
    .order('date', { ascending: true })

  if (error) throw error
  return data
}

export async function createMilestone(missionId: string, milestone: Omit<Database['public']['Tables']['milestones']['Insert'], 'id' | 'created_at' | 'mission_id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('milestones')
    .insert({ ...milestone, mission_id: missionId })
    .select()
    .single()

  if (error) throw error
  
  revalidatePath(`/missions/${missionId}`)
  return data
}

export async function updateMilestone(missionId: string, id: string, updates: Omit<Database['public']['Tables']['milestones']['Update'], 'id' | 'created_at' | 'mission_id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('milestones')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  
  revalidatePath(`/missions/${missionId}`)
  return data
}

export async function deleteMilestone(missionId: string, id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id)

  if (error) throw error
  
  revalidatePath(`/missions/${missionId}`)
}

export async function deleteMission(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get mission data first for revalidation
  const { data: mission } = await supabase
    .from('missions')
    .select('project_id')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('missions')
    .delete()
    .eq('id', id)

  if (error) throw error
  
  revalidatePath('/')
  revalidatePath('/projects')
  if (mission?.project_id) {
    revalidatePath(`/projects/${mission.project_id}`)
  }
}

