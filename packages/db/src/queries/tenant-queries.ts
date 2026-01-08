import { eq } from "drizzle-orm";

import { db } from "../db";
import { tenants, type Tenant } from "../schema/core-schema";

export async function getTenantBySlug(slug: string): Promise<Tenant | undefined> {
  const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, slug));
  return tenant;
}

export async function createTenantIfNotExists(slug: string): Promise<Tenant> {
  await db
    .insert(tenants)
    .values({
      slug,
      name: slug, // Fallback name
      status: "onboarding"
    })
    .onConflictDoNothing({ target: tenants.slug });

  // Fetch and return the tenant (either newly created or existing)
  const tenant = await getTenantBySlug(slug);
  if (!tenant) {
    throw new Error(`Failed to create or find tenant: ${slug}`);
  }
  return tenant;
}

export async function setTenantStatus({
  slug,
  status,
  error,
}: {
  slug: string;
  status: "active" | "suspended" | "onboarding";
  error?: string | null;
}): Promise<void> {
  await db
    .update(tenants)
    .set({ status, error: error ?? null })
    .where(eq(tenants.slug, slug));
}

// Legacy helpers mapped to jsonb or new fields
export async function saveTenantStorefrontConfig({
  slug,
  storefrontConfig,
}: {
  slug: string;
  storefrontConfig: unknown;
}): Promise<void> {
  await db
    .update(tenants)
    .set({ storefrontConfig, status: "active", error: null }) // Map ready -> active
    .where(eq(tenants.slug, slug));
}

export async function saveTenantDemoUrl({
  slug,
  demoUrl,
  v0ChatId,
}: {
  slug: string;
  demoUrl: string;
  v0ChatId?: string;
}): Promise<void> {
  await db
    .update(tenants)
    .set({ demoUrl, v0ChatId: v0ChatId ?? null, status: "active", error: null })
    .where(eq(tenants.slug, slug));
}

export async function saveTenantGeneratedFiles({
  slug,
  generatedFiles,
  v0ChatId,
}: {
  slug: string;
  generatedFiles: Array<{ name: string; content: string }>;
  v0ChatId?: string;
}): Promise<void> {
  await db
    .update(tenants)
    // Cast strict type if needed, or Drizzle handles jsonb
    .set({ generatedFiles: generatedFiles as any, v0ChatId: v0ChatId ?? null })
    .where(eq(tenants.slug, slug));
}

export async function saveTenantDeploymentUrl({
  slug,
  vercelDeploymentUrl,
}: {
  slug: string;
  vercelDeploymentUrl: string;
}): Promise<void> {
  await db
    .update(tenants)
    .set({ vercelDeploymentUrl, status: "active", error: null }) // Map deployed -> active
    .where(eq(tenants.slug, slug));
}

export async function getAllTenants(): Promise<Tenant[]> {
  return db.select().from(tenants);
}

export async function getTenantsWithV0ChatId(): Promise<Tenant[]> {
  const allTenants = await db.select().from(tenants);
  return allTenants.filter(t => t.v0ChatId);
}
