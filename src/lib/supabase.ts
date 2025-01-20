import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pmbkkslkkwhtsfukjqhx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYmtrc2xra3dodHNmdWtqcWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNzczMjIsImV4cCI6MjA1Mjk1MzMyMn0.fdBL1ZOyrlllYz26qO21RoilqTy3QGoSw7-AQPomIVU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
