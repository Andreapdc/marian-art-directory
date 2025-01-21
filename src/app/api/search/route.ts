import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(locations || [])
  } catch (error) {
    console.error('Error in search endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to search artworks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
