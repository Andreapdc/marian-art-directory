import { NextResponse } from 'next/server'
import { searchArtworks } from '@/lib/api/art-services'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
    const locations = await searchArtworks(query)
    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error in search endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to search artworks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
