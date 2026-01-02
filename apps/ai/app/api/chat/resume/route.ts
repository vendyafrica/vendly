import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'v0-sdk'
import { auth } from '@/app/(auth)/auth'

// Create v0 client with custom baseUrl if V0_API_URL is set
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {},
)

export async function POST(request: NextRequest) {
  try {
    // Keep auth call consistent with other endpoints (even if not required by v0)
    await auth()

    const { chatId, messageId } = await request.json()

    if (!chatId || typeof chatId !== 'string') {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 })
    }

    if (!messageId || typeof messageId !== 'string') {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 },
      )
    }

    // The SDK resume API resumes a specific message; response streaming is not
    // currently exposed via the typed client. We resume and let the client poll
    // chat details afterward.
    const resumed = await v0.chats.resume({ chatId, messageId })

    return NextResponse.json(resumed)
  } catch (error) {
    console.error('V0 resume error:', error)

    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    return NextResponse.json(
      {
        error: 'Failed to resume generation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
