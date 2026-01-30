import { db } from "@vendly/db/db";
import { stores, categories } from "@vendly/db/schema";
import { eq, and, exists, arrayContains, drizzleSql as sql } from "@vendly/db";

export const storeRepo = {
    async findById(id: string) {
        return db.query.stores.findFirst({
            where: eq(stores.id, id),
        });
    },

    async findActiveStores() {
        return db
            .select()
            .from(stores)
            .where(eq(stores.status, true));
    },

    async findBySlug(slug: string) {
        return db.query.stores.findFirst({
            where: eq(stores.slug, slug),
        });
    },

    async findActiveBySlug(slug: string) {
        return db.query.stores.findFirst({
            where: and(eq(stores.slug, slug), eq(stores.status, true)),
        });
    },

    // Find stores that have a specific category in their categories array
    // Note: stores.categories is a text[] or jsonb column depending on schema
    // We'll assume it's an array based on previous code usage
    async findByCategoryName(categoryName: string) {
        return db
            .select()
            .from(stores)
            .where(
                and(
                    eq(stores.status, true),
                    // Use sql operator for array containment to avoid strict type issues with Drizzle's arrayContains in some versions
                    sql`${stores.categories} @> ${[categoryName]}`
                )
            );
    },

    async findByTenantId(tenantId: string) {
        return db.query.stores.findMany({
            where: eq(stores.tenantId, tenantId),
        });
    },

    async create(data: typeof stores.$inferInsert) {
        const [store] = await db.insert(stores).values(data).returning();
        return store;
    },

    async update(id: string, tenantId: string, data: Partial<typeof stores.$inferInsert>) {
        const [updated] = await db
            .update(stores)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(stores.id, id), eq(stores.tenantId, tenantId)))
            .returning();
        return updated;
    },

    async delete(id: string, tenantId: string) {
        await db
            .update(stores)
            .set({ deletedAt: new Date() })
            .where(and(eq(stores.id, id), eq(stores.tenantId, tenantId)));
    }
};
