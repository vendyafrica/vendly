import { NextResponse } from 'next/server';
import { stores } from '@/constants/stores';

export async function GET() {
  // Simulate network delay for testing loading states
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return NextResponse.json(stores);
}
