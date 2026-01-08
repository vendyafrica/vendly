import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate network delay for testing loading states
  await new Promise(resolve => setTimeout(resolve, 1500));

  // TODO: Fetch stores from database with category information
  // For now, return empty array until real data is available
  return NextResponse.json([]);
}
