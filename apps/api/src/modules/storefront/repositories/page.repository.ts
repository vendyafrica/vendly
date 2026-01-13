import { db } from "@vendly/db/db";
import { storePages, type StorePage, type NewStorePage } from "@vendly/db/schema";
import { eq, and } from "drizzle-orm";

export const pageRepository = {
    async findById(id: string): Promise<StorePage | null> {
        const [page] = await db
            .select()
            .from(storePages)
            .where(eq(storePages.id, id))
            .limit(1);
        return page ?? null;
    },

    async findBySlug(storeId: string, slug: string): Promise<StorePage | null> {
        const [page] = await db
            .select()
            .from(storePages)
            .where(
                and(
                    eq(storePages.storeId, storeId),
                    eq(storePages.slug, slug)
                )
            )
            .limit(1);
        return page ?? null;
    },

    async findAllByStoreId(storeId: string): Promise<StorePage[]> {
        return db
            .select()
            .from(storePages)
            .where(eq(storePages.storeId, storeId));
    },

    async create(data: NewStorePage): Promise<StorePage> {
        const [page] = await db.insert(storePages).values(data).returning();
        return page;
    },

    async update(id: string, data: Partial<NewStorePage>): Promise<StorePage | null> {
        const [updated] = await db
            .update(storePages)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(storePages.id, id))
            .returning();
        return updated ?? null;
    },

    async publish(id: string, puckData: any): Promise<StorePage | null> {
        const [updated] = await db
            .update(storePages)
            .set({
                publishedPuckData: puckData,
                publishedAt: new Date(),
                isPublished: true,
                updatedAt: new Date()
            })
            .where(eq(storePages.id, id))
            .returning();
        return updated ?? null;
    },

    async delete(id: string): Promise<void> {
        await db.delete(storePages).where(eq(storePages.id, id));
    }
};

export type PageRepository = typeof pageRepository;
