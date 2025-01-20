import { NextResponse } from 'next/server'
import { fetchMetArtworks, fetchChicagoArtworks, fetchHarvardArtworks } from '@/lib/api/art-services'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      const { data: locations } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12)
      
      return NextResponse.json(locations || [])
    }

    // Search in Supabase first
    const { data: existingLocations } = await supabase
      .from('locations')
      .select('*')
      .textSearch('name', query, { type: 'websearch' })
      .limit(12)

    // If we have enough results, return them
    if (existingLocations && existingLocations.length >= 6) {
      return NextResponse.json(existingLocations)
    }

    // Otherwise, fetch new data from APIs
    await Promise.all([
      fetchMetArtworks(query),
      fetchChicagoArtworks(query),
      fetchHarvardArtworks(query)
    ])

    // Get updated results from Supabase
    const { data: updatedLocations } = await supabase
      .from('locations')
      .select('*')
      .textSearch('name', query, { type: 'websearch' })
      .limit(12)

    return NextResponse.json(updatedLocations || [])
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    )
  }
}
