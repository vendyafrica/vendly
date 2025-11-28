import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Authentication removed - return empty chats list
  return NextResponse.json({ data: [] })
}
