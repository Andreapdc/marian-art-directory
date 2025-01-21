import { NextResponse } from 'next/server'
import { syncArtData } from '@/lib/api/art-services'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST() {
  try {
    console.log('Starting sync process...')
    const result = await syncArtData()
    console.log('Sync completed:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in sync endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to sync art data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
