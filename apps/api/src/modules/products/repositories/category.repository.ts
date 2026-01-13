import { db } from "@vendly/db/db";
import { storeCategories, productCategories, type StoreCategory, type NewStoreCategory } from "@vendly/db/schema";
import { eq, and } from "drizzle-orm";

export const categoryRepository = {
    async findById(id: string): Promise<StoreCategory | null> {
        const [category] = await db
            .select()
            .from(storeCategories)
            .where(eq(storeCategories.id, id))
            .limit(1);
        return category ?? null;
    },

    async findAllByStoreId(storeId: string): Promise<StoreCategory[]> {
        return db
            .select()
            .from(storeCategories)
            .where(eq(storeCategories.storeId, storeId));
    },

    async create(data: NewStoreCategory): Promise<StoreCategory> {
        const [category] = await db.insert(storeCategories).values(data).returning();
        return category;
    },

    async update(id: string, data: Partial<NewStoreCategory>): Promise<StoreCategory | null> {
        const [updated] = await db
            .update(storeCategories)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(storeCategories.id, id))
            .returning();
        return updated ?? null;
    },

    async delete(id: string): Promise<void> {
        await db.delete(storeCategories).where(eq(storeCategories.id, id));
    },

    async addProductToCategory(productId: string, categoryId: string): Promise<void> {
        await db.insert(productCategories)
            .values({ productId, categoryId })
            .onConflictDoNothing();
    }
};

export type CategoryRepository = typeof categoryRepository;
