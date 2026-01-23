export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          label: string | null
          description: string | null
          status: 'active' | 'archived'
          color: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
          name: string
          label?: string | null
          description?: string | null
          status?: 'active' | 'archived'
          color: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          label?: string | null
          description?: string | null
          status?: 'active' | 'archived'
          color?: string
        }
      }
      missions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          type: string
          estimation: number
          confidence: number | null
          project_parent: string | null
          project_id: string | null
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
          title: string
          type: string
          estimation?: number
          confidence?: number | null
          project_parent?: string | null
          project_id?: string | null
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          type?: string
          estimation?: number
          confidence?: number | null
          project_parent?: string | null
          project_id?: string | null
          status?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          created_at: string
          mission_id: string
          title: string
          is_completed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          mission_id: string
          title: string
          is_completed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          mission_id?: string
          title?: string
          is_completed?: boolean
        }
      }
    }
  }
}
