import { db } from "@vendly/db/db";
import { stores, type NewStore } from "@vendly/db/schema";
import { eq, and, isNull } from "drizzle-orm";

/**
 * Store Service for serverless environment
 */
export const storeService = {
    /**
     * Find store by ID
     */
    async findById(id: string) {
        const store = await db.query.stores.findFirst({
            where: and(eq(stores.id, id), isNull(stores.deletedAt)),
        });
        return store ?? null;
    },

    /**
     * Find store by slug
     */
    async findBySlug(slug: string) {
        const store = await db.query.stores.findFirst({
            where: and(eq(stores.slug, slug), isNull(stores.deletedAt)),
        });
        return store ?? null;
    },

    /**
     * Find stores by tenant ID
     */
    async findByTenantId(tenantId: string) {
        return db.query.stores.findMany({
            where: and(eq(stores.tenantId, tenantId), isNull(stores.deletedAt)),
        });
    },

    /**
     * Create a new store
     */
    async create(data: NewStore) {
        const [store] = await db.insert(stores).values(data).returning();
        return store;
    },

    /**
     * Update a store
     */
    async update(id: string, tenantId: string, data: Partial<NewStore>) {
        const [updated] = await db
            .update(stores)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(stores.id, id), eq(stores.tenantId, tenantId)))
            .returning();
        return updated ?? null;
    },

    /**
     * Soft delete a store
     */
    async delete(id: string, tenantId: string) {
        await db
            .update(stores)
            .set({ deletedAt: new Date() })
            .where(and(eq(stores.id, id), eq(stores.tenantId, tenantId)));
    },

    /**
     * Update store status
     */
    async updateStatus(id: string, tenantId: string, status: "draft" | "active" | "suspended") {
        const [updated] = await db
            .update(stores)
            .set({ status, updatedAt: new Date() })
            .where(and(eq(stores.id, id), eq(stores.tenantId, tenantId)))
            .returning();
        return updated ?? null;
    },
};
