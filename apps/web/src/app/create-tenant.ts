'use server';

import { db } from '@vendly/db';
import { demo } from '@vendly/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

const RESERVED = [
  'www',
  'admin',
  'ai',
  'api',
  'support',
  'docs',
];

function sanitizeSubdomain(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '');
}

export async function createTenant(
  _: any,
  formData: FormData
) {
  const name = formData.get('name') as string;
  const subdomainRaw = formData.get('subdomain') as string;
  const category = formData.get('category') as string;

  if (!name || !subdomainRaw || !category) {
    return { error: 'All fields are required' };
  }

  const subdomain = sanitizeSubdomain(subdomainRaw);
  if (!subdomain) return { error: 'Invalid subdomain format' };

  if (RESERVED.includes(subdomain)) {
    return { error: 'Subdomain is reserved' };
  }

  const existing = await db
    .select()
    .from(demo)
    .where(eq(demo.subdomain, subdomain))
    .limit(1);

  if (existing.length) {
    return { error: 'Subdomain already taken' };
  }

  await db.insert(demo).values({
    name,
    subdomain,
    category,
  });

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'vendlyafrica.store';
  redirect(`https://${subdomain}.${rootDomain}`);
}
