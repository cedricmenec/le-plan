export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
      }
      missions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          type: string
          goal: string | null
          notes: string | null
          estimation: number
          confidence: number | null
          project_parent: string | null
          project_id: string | null
          status: string
          estimated_delivery_date: string | null
          desired_delivery_date: string | null
          priority: 'low' | 'medium' | 'high' | 'critical'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
          title: string
          type: string
          goal?: string | null
          notes?: string | null
          estimation?: number
          confidence?: number | null
          project_parent?: string | null
          project_id?: string | null
          status?: string
          estimated_delivery_date?: string | null
          desired_delivery_date?: string | null
          priority?: 'low' | 'medium' | 'high' | 'critical'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          type?: string
          goal?: string | null
          notes?: string | null
          estimation?: number
          confidence?: number | null
          project_parent?: string | null
          project_id?: string | null
          status?: string
          estimated_delivery_date?: string | null
          desired_delivery_date?: string | null
          priority?: 'low' | 'medium' | 'high' | 'critical'
        }
        Relationships: [
          {
            foreignKeyName: "missions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      subtasks: {
        Row: {
          id: string
          created_at: string
          mission_id: string
          title: string
          is_completed: boolean
          position: number
        }
        Insert: {
          id?: string
          created_at?: string
          mission_id: string
          title: string
          is_completed?: boolean
          position?: number
        }
        Update: {
          id?: string
          created_at?: string
          mission_id?: string
          title?: string
          is_completed?: boolean
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "subtasks_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          }
        ]
      }
      milestone_types: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          id: string
          mission_id: string
          type_id: string
          date: string
          title: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          mission_id: string
          type_id: string
          date: string
          title: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          mission_id?: string
          type_id?: string
          date?: string
          title?: string
          note?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "milestone_types"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
