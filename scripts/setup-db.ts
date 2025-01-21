import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://pmbkkslkkwhtsfukjqhx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYmtrc2xra3dodHNmdWtqcWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM3NzMyMiwiZXhwIjoyMDUyOTUzMzIyfQ.DaTBv8iP7ri6Yt1aHk3GughlxxsuxH8yQUi_uYqks0o'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    const sqlPath = path.join(__dirname, '../supabase/init.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim())
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', {
          query: statement + ';'
        })
        
        if (error) {
          console.error('Error executing statement:', error)
          console.error('Statement:', statement)
        } else {
          console.log('Successfully executed statement')
        }
      }
    }
    
    console.log('Database setup completed successfully')
  } catch (error) {
    console.error('Error setting up database:', error)
  }
}

setupDatabase()
