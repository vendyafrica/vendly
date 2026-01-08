import { NextResponse } from 'next/server';
import { stores } from '@/constants/stores';
import type { Category } from '@/constants/stores';
import { categories } from '@/constants/stores';

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  // Simulate network delay for testing loading states
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const category = params.category as Category;
  
  // Validate category
  if (!categories.includes(category)) {
    return NextResponse.json(
      { error: 'Category not found' },
      { status: 404 }
    );
  }
  
  // Filter stores by category
  const categoryStores = stores.filter(store => store.category === category);
  
  return NextResponse.json({
    stores: categoryStores,
    count: categoryStores.length,
    category
  });
}
