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
