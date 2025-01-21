import { NextResponse } from 'next/server'
import { syncArtData } from '@/lib/api/art-services'

export async function POST() {
  try {
    const result = await syncArtData()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in sync endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to sync art data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Prevent caching
export const dynamic = 'force-dynamic'
