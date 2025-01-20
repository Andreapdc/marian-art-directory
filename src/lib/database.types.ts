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
      locations: {
        Row: {
          id: string
          name: string
          description: string
          photos: string[]
          tags: string[]
          coordinates: { latitude: number; longitude: number } | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          photos?: string[]
          tags?: string[]
          coordinates?: { latitude: number; longitude: number } | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          photos?: string[]
          tags?: string[]
          coordinates?: { latitude: number; longitude: number } | null
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          venue: string
          location_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          venue: string
          location_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          venue?: string
          location_id?: string
          updated_at?: string
        }
      }
      ai_content: {
        Row: {
          id: string
          content: string
          source_type: 'location' | 'event' | 'user'
          source_id: string
          content_type: 'description' | 'summary' | 'recommendation'
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          source_type: 'location' | 'event' | 'user'
          source_id: string
          content_type: 'description' | 'summary' | 'recommendation'
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          source_type?: 'location' | 'event' | 'user'
          source_id?: string
          content_type?: 'description' | 'summary' | 'recommendation'
          metadata?: Json
          updated_at?: string
        }
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
  }
}
