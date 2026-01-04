import { db, demo } from '@vendly/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

type Props = {
  params: { subdomain: string };
};

export default async function TenantPage({ params }: Props) {
  const tenant = await db
    .select()
    .from(demo)
    .where(eq(demo.subdomain, params.subdomain))
    .limit(1);

  if (!tenant.length) {
    notFound();
  }

  const { name, category } = tenant[0];
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'vendlyafrica.store';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mt-4">{name}</h1>
      <p className="text-muted-foreground mt-2">{category}</p>
      <p className="text-muted-foreground mt-2">
        Welcome to {params.subdomain}.{rootDomain}
      </p>
    </main>
  );
}
