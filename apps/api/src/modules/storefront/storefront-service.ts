import { db, stores, storeThemes, storeContent, tenants, eq } from "@vendly/db";
import { CreateStoreRequest, UpdateStoreRequest, StoreResponse, PageData } from "./storefront-model";
import { vercelDeploymentService } from "../deployment/vercel-service";


export class StorefrontService {
    /**
     * Create a new store for a tenant
     */
    async createStore(data: CreateStoreRequest): Promise<StoreResponse> {
        // 1. Get Tenant
        const [tenant] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.slug, data.tenantSlug))
            .limit(1);

        if (!tenant) {
            throw new Error(`Tenant '${data.tenantSlug}' not found`);
        }

        // 2. Check if store slug exists (globally or per tenant? Slug is subdomain, so globally unique usually, but for now unique per tenant in schema)
        // Schema says: unique("stores_tenant_slug_unique").on(table.tenantId, table.slug)
        // BUT if we use subdomains (slug.vendly.com), we probably want global uniqueness for the store slug if it maps to subdomain.
        // Assuming store slug = subdomain.
        const [existingStore] = await db
            .select()
            .from(stores)
            .where(eq(stores.slug, data.slug))
            .limit(1);

        if (existingStore) {
            throw new Error(`Store with slug '${data.slug}' already exists`);
        }

        // 3. Create Store
        const [newStore] = await db.insert(stores).values({
            tenantId: tenant.id,
            name: data.name,
            slug: data.slug,
            status: "draft",
            defaultCurrency: "UGX", // Default
        }).returning();

        // 4. Create Default Theme
        const themeConfig = data.theme || {
            primaryColor: "#1a1a2e",
            secondaryColor: "#4a6fa5",
            accentColor: "#e94560",
            backgroundColor: "#ffffff",
            textColor: "#1a1a2e",
            headingFont: "Playfair Display",
            bodyFont: "Inter",
        };

        const [newTheme] = await db.insert(storeThemes).values({
            tenantId: tenant.id,
            storeId: newStore.id,
            ...themeConfig
        }).returning();

        // 5. Create Default Content
        const [newContent] = await db.insert(storeContent).values({
            tenantId: tenant.id,
            storeId: newStore.id,
            hero: {
                label: "New Collection",
                title: `Welcome to ${data.name}`,
                subtitle: "Discover our premium collection.",
                ctaText: "Shop Now",
                layout: "centered",
                enabled: true
            },
            sections: [],
            footer: {
                showSocialLinks: true,
                showNewsletter: true,
                copyright: `© ${new Date().getFullYear()} ${data.name}`
            }
        }).returning();

        return {
            id: newStore.id,
            tenantId: newStore.tenantId,
            name: newStore.name,
            slug: newStore.slug,
            description: newStore.description,
            status: newStore.status,
            logoUrl: newStore.logoUrl,
            theme: newTheme,
            content: {
                heroLabel: newContent.hero?.label,
                heroTitle: newContent.hero?.title,
                heroSubtitle: newContent.hero?.subtitle,
                heroCta: newContent.hero?.ctaText,
                sections: newContent.sections,
                footer: newContent.footer
            },
            defaultCurrency: newStore.defaultCurrency,
            createdAt: newStore.createdAt,
        };
    }

    /**
     * Get store by slug (for storefront view)
     */
    async getStoreBySlug(slug: string): Promise<StoreResponse | null> {
        const [store] = await db
            .select()
            .from(stores)
            .where(eq(stores.slug, slug))
            .limit(1);

        if (!store) return null;

        // Fetch theme
        const [theme] = await db
            .select()
            .from(storeThemes)
            .where(eq(storeThemes.storeId, store.id))
            .limit(1);

        // Fetch content
        const [content] = await db
            .select()
            .from(storeContent)
            .where(eq(storeContent.storeId, store.id))
            .limit(1);

        return {
            id: store.id,
            tenantId: store.tenantId,
            name: store.name,
            slug: store.slug,
            description: store.description,
            status: store.status,
            logoUrl: store.logoUrl,
            theme: theme || {},
            content: content ? {
                // Flatten nested DB content for frontend compatibility
                heroLabel: content.hero?.label,
                heroTitle: content.hero?.title,
                heroSubtitle: content.hero?.subtitle,
                heroCta: content.hero?.ctaText,
                heroLink: content.hero?.ctaLink,
                heroImageUrl: content.hero?.imageUrl,

                // Pass through sections and footer for components that can handle them
                sections: content.sections,
                footer: content.footer,
            } : {},
            defaultCurrency: store.defaultCurrency,
            createdAt: store.createdAt,
        };
    }

    /**
     * Publish Store (Integrate with Vercel Deployment)
     */
    async publishStore(storeId: string): Promise<boolean> {
        // 1. Get Store
        const [store] = await db
            .select()
            .from(stores)
            .where(eq(stores.id, storeId))
            .limit(1);

        if (!store) throw new Error("Store not found");

        // 2. Trigger Vercel Deployment for the subdomain (store.slug)
        // NOTE: The deployments service currently expects a "tenant slug" but logically the store slug IS the subdomain.
        // We verify if `tenant-queries` or `vercel-service` assumes tenant.slug or if we can pass store.slug.
        // `deployTenant` in `vercel-service.ts` uses `getTenantBySlug(slug)`.
        // This implies the Tenant Slug MUST match the Subdomain?
        // Wait, `stores` have a slug. Tenants have a slug.
        // If a Tenant has multiple stores, they need different subdomains.
        // `vercel-service` seems designed for 1 tenant = 1 subdomain.
        // However, we are building a multi-store platform.
        // For now, let's assume the Store Slug is what we want to deploy as a subdomain.

        // We might need to bypass `deployTenant` and call `addSubdomainToVercel` directly if we want granular control,
        // OR we align Tenant Slug == Store Slug for single-store tenants.

        // Let's call `addSubdomainToVercel` directly from the service if needed, OR update `deployTenant`.
        // Given existing code in `vercel-service.ts`, it does `addSubdomainToVercel(slug)`.

        const deployResult = await vercelDeploymentService.addSubdomainToVercel(store.slug);

        if (!deployResult.success) {
            throw new Error(`Deployment failed: ${deployResult.error}`);
        }

        // 3. Update Status
        await db
            .update(stores)
            .set({ status: "active", updatedAt: new Date() })
            .where(eq(stores.id, storeId));

        return true;
    }

    /**
     * Update Store Config
     */
    async updateStore(storeId: string, data: UpdateStoreRequest): Promise<void> {
        if (data.name || data.description) {
            await db.update(stores).set({
                name: data.name,
                description: data.description,
                updatedAt: new Date()
            }).where(eq(stores.id, storeId));
        }

        if (data.theme) {
            await db.update(storeThemes).set({
                ...data.theme,
                updatedAt: new Date()
            }).where(eq(storeThemes.storeId, storeId));
        }

        if (data.content) {
            // We need to merge or replace. Drizzle jsonb support usually replaces.
            // Let's fetch existing first if we want merge, or just replace.
            // Assuming replace/merge logic handled by frontend sending full object or we do deep merge here.
            // For simplicity, we assume one level merge or replace.

            await db.update(storeContent).set({
                data: data.content,
                updatedAt: new Date()
            }).where(eq(storeContent.storeId, storeId));
        }
    }
    /**
     * Get Page Data for Editor/Storefront
     */
    async getPageData(tenantSlug: string): Promise<{ pageData: PageData } | null> {
        // 1. Get Tenant & Store (Assuming single store per tenant for now or main store)
        // We really should look up by store slug if possible, but the route param is :slug (which maps to tenant or store?)
        // The URL is /api/storefront/${tenant}/page-data. So 'tenant' param is likely the tenant slug (which is also the store slug usually).

        const [store] = await db
            .select()
            .from(stores)
            .where(eq(stores.slug, tenantSlug))
            .limit(1);

        if (!store) return null;

        // 2. Fetch Content
        const [content] = await db
            .select()
            .from(storeContent)
            .where(eq(storeContent.storeId, store.id))
            .limit(1);

        // 3. Transform to PageData (Puck format)
        // If we have stored editorData (Puck JSON), return that directly.
        // Otherwise, construct it from structured fields (hero, sections).

        if (content?.editorData) {
            return { pageData: content.editorData as PageData };
        }

        // Construct from parts
        const blocks: any[] = [];

        // Hero
        if (content?.hero && content.hero.enabled !== false) {
            blocks.push({
                type: "Hero",
                props: {
                    title: content.hero.title,
                    subtitle: content.hero.subtitle,
                    ctaText: content.hero.ctaText,
                    ctaLink: content.hero.ctaLink,
                    imageUrl: content.hero.imageUrl,
                    id: "hero" // Puck needs unique IDs? usually auto-generated
                }
            });
        }

        // Sections
        if (content?.sections && Array.isArray(content.sections)) {
            content.sections.forEach((sec: any) => {
                if (sec.enabled === false) return;

                if (sec.type === "products") {
                    blocks.push({
                        type: "ProductsGrid", // Example component name
                        props: {
                            title: sec.title,
                            id: sec.id
                        }
                    });
                }
                // Add more mappings as needed
            });
        }

        // Footer (Usually part of root layout props or a block, depending on Puck config)
        // Let's assume Footer is a block for now or handled by Layout.

        return {
            pageData: {
                content: blocks,
                root: { props: { title: store.name } }
            }
        };
    }
}

export const storefrontService = new StorefrontService();
