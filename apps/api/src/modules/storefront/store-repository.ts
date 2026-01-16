import { db } from "@vendly/db/db";
import { stores, type Store, type NewStore } from "@vendly/db/schema";
import { eq } from "drizzle-orm";

export const storeRepository = {
    async findById(id: string): Promise<Store | null> {
        const [store] = await db
            .select()
            .from(stores)
            .where(eq(stores.id, id))
            .limit(1);
        return store ?? null;
    },

    async findBySlug(slug: string): Promise<Store | null> {
        const [store] = await db
            .select()
            .from(stores)
            .where(eq(stores.slug, slug))
            .limit(1);
        return store ?? null;
    },

    async findByTenantId(tenantId: string): Promise<Store[]> {
        return db
            .select()
            .from(stores)
            .where(eq(stores.tenantId, tenantId));
    },

    async create(data: NewStore): Promise<Store> {
        const [store] = await db.insert(stores).values(data).returning();
        return store;
    },

    async update(id: string, data: Partial<NewStore>): Promise<Store | null> {
        const [updated] = await db
            .update(stores)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(stores.id, id))
            .returning();
        return updated ?? null;
    },

    async delete(id: string): Promise<void> {
        await db.delete(stores).where(eq(stores.id, id));
    },

    async updateStatus(id: string, status: "draft" | "active" | "suspended"): Promise<Store | null> {
        const [updated] = await db
            .update(stores)
            .set({ status, updatedAt: new Date() })
            .where(eq(stores.id, id))
            .returning();
        return updated ?? null;
    }
};

export type StoreRepository = typeof storeRepository;
