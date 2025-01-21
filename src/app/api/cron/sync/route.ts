import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { syncArtData } from '@/lib/api/art-services'

// This secret should match the one you set in your cron job service
const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-key'

export async function POST() {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')

    // Verify the request is coming from our cron job
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await syncArtData()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in cron sync:', error)
    return NextResponse.json(
      { error: 'Failed to sync art data' },
      { status: 500 }
    )
  }
}

// Prevent caching
export const dynamic = 'force-dynamic'
