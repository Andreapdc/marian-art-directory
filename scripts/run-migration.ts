import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pmbkkslkkwhtsfukjqhx.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYmtrc2xra3dodHNmdWtqcWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM3NzMyMiwiZXhwIjoyMDUyOTUzMzIyfQ.DaTBv8iP7ri6Yt1aHk3GughlxxsuxH8yQUi_uYqks0o'

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  try {
    // Add metadata column if it doesn't exist
    const { error: alterError } = await supabase.rpc('add_metadata_column', {
      table_name: 'locations'
    })

    if (alterError) {
      console.error('Error adding metadata column:', alterError)
      return
    }

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

runMigration()
