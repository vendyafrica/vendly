import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  // Authentication removed - chat visibility changes disabled
  return NextResponse.json(
    { error: 'Chat visibility management is not available' },
    { status: 403 },
  )
}
