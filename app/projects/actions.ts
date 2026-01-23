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
    .select('*, missions(id, status)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProject(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, missions(*, projects(name))')
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
