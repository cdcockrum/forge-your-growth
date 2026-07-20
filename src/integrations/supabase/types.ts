export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          description: string | null
          earned_at: string
          id: string
          key: string
          title: string
          user_id: string
        }
        Insert: {
          description?: string | null
          earned_at?: string
          id?: string
          key: string
          title: string
          user_id: string
        }
        Update: {
          description?: string | null
          earned_at?: string
          id?: string
          key?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      focus_items: {
        Row: {
          category: string | null
          chronicle: boolean
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          priority: number
          scheduled_date: string | null
          sort_order: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          chronicle?: boolean
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          priority?: number
          scheduled_date?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          chronicle?: boolean
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          priority?: number
          scheduled_date?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      life_areas: {
        Row: {
          archived: boolean
          color: string
          created_at: string
          icon: string
          id: string
          name: string
          priority: number
          sort_order: number
          updated_at: string
          user_id: string
          vision: string | null
        }
        Insert: {
          archived?: boolean
          color?: string
          created_at?: string
          icon?: string
          id?: string
          name: string
          priority?: number
          sort_order?: number
          updated_at?: string
          user_id: string
          vision?: string | null
        }
        Update: {
          archived?: boolean
          color?: string
          created_at?: string
          icon?: string
          id?: string
          name?: string
          priority?: number
          sort_order?: number
          updated_at?: string
          user_id?: string
          vision?: string | null
        }
        Relationships: []
      }
      practice_sessions: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          duration_minutes: number
          id: string
          intensity: string | null
          notes: string | null
          reflection: string | null
          scheduled_date: string
          scheduled_time: string | null
          skill_id: string | null
          sort_order: number
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          intensity?: string | null
          notes?: string | null
          reflection?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          skill_id?: string | null
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          intensity?: string | null
          notes?: string | null
          reflection?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          skill_id?: string | null
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          onboarded: boolean
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          onboarded?: boolean
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          onboarded?: boolean
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reflections: {
        Row: {
          created_at: string
          difficult: string | null
          feeling: number | null
          focus_next_week: string | null
          id: string
          learned: string | null
          updated_at: string
          user_id: string
          week_start: string
          went_well: string | null
        }
        Insert: {
          created_at?: string
          difficult?: string | null
          feeling?: number | null
          focus_next_week?: string | null
          id?: string
          learned?: string | null
          updated_at?: string
          user_id: string
          week_start: string
          went_well?: string | null
        }
        Update: {
          created_at?: string
          difficult?: string | null
          feeling?: number | null
          focus_next_week?: string | null
          id?: string
          learned?: string | null
          updated_at?: string
          user_id?: string
          week_start?: string
          went_well?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          archived: boolean
          created_at: string
          current_level: number
          description: string | null
          difficulty: number
          id: string
          life_area_id: string | null
          name: string
          notes: string | null
          preferred_days: string[]
          session_minutes: number
          target_frequency: number
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          created_at?: string
          current_level?: number
          description?: string | null
          difficulty?: number
          id?: string
          life_area_id?: string | null
          name: string
          notes?: string | null
          preferred_days?: string[]
          session_minutes?: number
          target_frequency?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          created_at?: string
          current_level?: number
          description?: string | null
          difficulty?: number
          id?: string
          life_area_id?: string | null
          name?: string
          notes?: string | null
          preferred_days?: string[]
          session_minutes?: number
          target_frequency?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reviews: {
        Row: {
          challenges: string | null
          created_at: string | null
          energy: number | null
          focus_next_week: string | null
          id: string
          lessons: string | null
          updated_at: string | null
          user_id: string
          week_start: string
          wins: string | null
        }
        Insert: {
          challenges?: string | null
          created_at?: string | null
          energy?: number | null
          focus_next_week?: string | null
          id?: string
          lessons?: string | null
          updated_at?: string | null
          user_id: string
          week_start: string
          wins?: string | null
        }
        Update: {
          challenges?: string | null
          created_at?: string | null
          energy?: number | null
          focus_next_week?: string | null
          id?: string
          lessons?: string | null
          updated_at?: string | null
          user_id?: string
          week_start?: string
          wins?: string | null
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
