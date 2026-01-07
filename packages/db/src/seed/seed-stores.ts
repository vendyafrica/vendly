import { db } from "../db";
import { tenants, users, tenantMemberships } from "../schema/core-schema";
import { stores, storeMemberships, storeThemes, storeContent } from "../schema/storefront-schema";
import { eq, and } from "drizzle-orm";

export async function seedStores() {
    console.log("🌱 Seeding Stores...");

    // Fetch all tenants
    const allTenants = await db.select().from(tenants);

    for (const tenant of allTenants) {
        // 1. Create Store
        const storeSlug = tenant.slug; // For now, 1 store per tenant = same slug
        const [store] = await db
            .insert(stores)
            .values({
                tenantId: tenant.id,
                name: tenant.name,
                slug: storeSlug,
                status: "active",
                defaultCurrency: "KES",
                logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${tenant.name}`,
            })
            .onConflictDoUpdate({
                target: [stores.tenantId, stores.slug],
                set: { name: tenant.name, status: "active" }
            })
            .returning();

        // 2. Find Owner
        // Query tenantMemberships for owner
        const [membership] = await db
            .select()
            .from(tenantMemberships)
            .where(and(eq(tenantMemberships.tenantId, tenant.id), eq(tenantMemberships.role, "owner")))
            .limit(1);

        if (membership) {
            // Create Store Membership
            await db
                .insert(storeMemberships)
                .values({
                    storeId: store.id,
                    userId: membership.userId,
                    role: "store_owner"
                })
                .onConflictDoNothing();
        }

        // 3. Create Theme
        await db
            .insert(storeThemes)
            .values({
                storeId: store.id,
                tenantId: tenant.id,
                presetName: "bold_modern",
                primaryColor: "#000000",
                secondaryColor: "#ffffff"
            })
            .onConflictDoNothing();

        // 4. Create Content
        await db
            .insert(storeContent)
            .values({
                storeId: store.id,
                tenantId: tenant.id,
                heroTitle: `Welcome to ${tenant.name}`,
                heroSubtitle: "Shop the best products in Kenya",
                heroCta: "Shop Now",
            })
            .onConflictDoNothing();
    }

    console.log("✅ Stores seeded");
}
