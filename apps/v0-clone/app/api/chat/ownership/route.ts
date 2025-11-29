import { NextRequest, NextResponse } from 'next/server'
import { createAnonymousChatLog } from '@/lib/db/queries'

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIP) {
    return realIP
  }

  // Fallback to connection remote address or unknown
  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const { chatId } = await request.json()

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 },
      )
    }

    // Anonymous user - log for rate limiting
    const clientIP = getClientIP(request)
    await createAnonymousChatLog({
      ipAddress: clientIP,
      v0ChatId: chatId,
    })
    console.log('Anonymous chat logged via API:', chatId, 'IP:', clientIP)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to create chat log:', error)
    return NextResponse.json(
      { error: 'Failed to create record' },
      { status: 500 },
    )
  }
}
