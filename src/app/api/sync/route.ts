import { NextResponse } from 'next/server'
import { syncArtData } from '@/lib/api/art-services'

export async function POST() {
  try {
    await syncArtData()
    return NextResponse.json({ message: 'Art data synchronized successfully' })
  } catch (error) {
    console.error('Error syncing art data:', error)
    return NextResponse.json(
      { error: 'Failed to sync art data' },
      { status: 500 }
    )
  }
}

// Allow this endpoint to be called every hour
export const revalidate = 3600
