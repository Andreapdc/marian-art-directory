import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    console.log('Starting search...')
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
    console.log('Searching for:', query)
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log(`Found ${locations?.length || 0} results`)
    return NextResponse.json(locations || [])
  } catch (error) {
    console.error('Error in search endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to search artworks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
