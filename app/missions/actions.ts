'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database.types'

type Mission = Database['public']['Tables']['missions']['Row']
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

export async function updateMission(id: string, updates: Omit<UpdateMission, 'id' | 'created_at' | 'user_id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('missions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
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
  
  // Revalidate the mission detail page if we know the mission_id
  if (data.mission_id) {
    revalidatePath(`/missions/${data.mission_id}`)
  }

  return data
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

