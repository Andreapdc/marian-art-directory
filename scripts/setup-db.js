const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://pmbkkslkkwhtsfukjqhx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYmtrc2xra3dodHNmdWtqcWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM3NzMyMiwiZXhwIjoyMDUyOTUzMzIyfQ.DaTBv8iP7ri6Yt1aHk3GughlxxsuxH8yQUi_uYqks0o'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    // Drop existing tables
    console.log('Dropping existing tables...')
    await supabase.from('ai_content').delete().neq('id', 0)
    await supabase.from('events').delete().neq('id', 0)
    await supabase.from('locations').delete().neq('id', 0)

    // Create locations table
    console.log('Creating locations table...')
    await supabase.from('locations').delete().neq('id', 0)
    const { error: locationsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        photos TEXT[] DEFAULT '{}',
        tags TEXT[] DEFAULT '{}',
        coordinates JSONB,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `)
    if (locationsError) console.error('Error creating locations table:', locationsError)

    // Create events table
    console.log('Creating events table...')
    const { error: eventsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TIMESTAMPTZ NOT NULL,
        venue TEXT NOT NULL,
        location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `)
    if (eventsError) console.error('Error creating events table:', eventsError)

    // Create ai_content table
    console.log('Creating ai_content table...')
    const { error: aiContentError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS ai_content (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        source_type TEXT NOT NULL CHECK (source_type IN ('location', 'event', 'user')),
        source_id UUID NOT NULL,
        content_type TEXT NOT NULL CHECK (content_type IN ('description', 'summary', 'recommendation')),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `)
    if (aiContentError) console.error('Error creating ai_content table:', aiContentError)

    // Insert sample data
    console.log('Inserting sample data...')
    const { error: sampleDataError } = await supabase
      .from('locations')
      .insert([
        {
          name: 'St. Mary\'s Cathedral',
          description: 'A historic cathedral showcasing Gothic architecture and religious artifacts.',
          tags: ['historical', 'religious', 'architecture'],
          metadata: { source: 'local', id: 'st-marys-cathedral' }
        },
        {
          name: 'Modern Art Gallery',
          description: 'Contemporary art space featuring local and international artists.',
          tags: ['art', 'modern', 'cultural'],
          metadata: { source: 'local', id: 'modern-art-gallery' }
        },
        {
          name: 'Cultural Heritage Museum',
          description: 'Museum dedicated to preserving local history and traditions.',
          tags: ['museum', 'history', 'cultural'],
          metadata: { source: 'local', id: 'cultural-heritage-museum' }
        }
      ])
    if (sampleDataError) console.error('Error inserting sample data:', sampleDataError)

    console.log('Database setup completed successfully')
  } catch (error) {
    console.error('Error setting up database:', error)
  }
}

setupDatabase()
