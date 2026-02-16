'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']
type InsertProject = Database['public']['Tables']['projects']['Insert']
type UpdateProject = Database['public']['Tables']['projects']['Update']

export async function getProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, missions(*, subtasks(*))')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getProject(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, missions(*, projects(name), subtasks(*))')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createProject(project: Omit<InsertProject, 'id' | 'created_at' | 'user_id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...project, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  revalidatePath('/projects')
  return data
}

export async function updateProject(id: string, updates: Omit<UpdateProject, 'id' | 'created_at' | 'user_id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/projects')
  return data
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check for missions first
  const { count, error: countError } = await supabase
    .from('missions')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', id)
    
  if (countError) throw countError
  
  if (count && count > 0) {
    throw new Error('Cannot delete project with attached missions')
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/projects')
}

export async function getRecentlyCompletedMissions(projectId: string, days: number) {
  const supabase = await createClient()
  
  let query = supabase
    .from('missions')
    .select('*, subtasks(*)')
    .eq('project_id', projectId)
    .eq('status', 'done')

  // If days > 0, apply date filter. If 0 or -1, fetch all.
  if (days > 0) {
    const dateLimit = new Date()
    dateLimit.setDate(dateLimit.getDate() - days)
    query = query.gte('completed_at', dateLimit.toISOString())
  }
  
  const { data, error } = await query.order('completed_at', { ascending: false }).order('created_at', { ascending: false })

  if (error) {
    // If columns don't exist yet, return empty array instead of crashing
    if (error.code === '42703') {
      // Fallback: try fetching without completed_at filter if it fails
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('missions')
        .select('*, subtasks(*)')
        .eq('project_id', projectId)
        .eq('status', 'done')
        .order('created_at', { ascending: false })
      
      if (fallbackError) throw fallbackError
      return fallbackData
    }
    throw error
  }
  return data
}
