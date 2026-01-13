import { db } from "@vendly/db/db";
import { products, type Product, type NewProduct } from "@vendly/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export const productRepository = {
    async findById(id: string): Promise<Product | null> {
        const [product] = await db
            .select()
            .from(products)
            .where(eq(products.id, id))
            .limit(1);
        return product ?? null;
    },

    async findByStoreId(storeId: string, limit = 50, offset = 0): Promise<Product[]> {
        return db
            .select()
            .from(products)
            .where(eq(products.storeId, storeId))
            .orderBy(desc(products.createdAt))
            .limit(limit)
            .offset(offset);
    },

    async create(data: NewProduct): Promise<Product> {
        const [product] = await db.insert(products).values(data).returning();
        return product;
    },

    async update(id: string, data: Partial<NewProduct>): Promise<Product | null> {
        const [updated] = await db
            .update(products)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(products.id, id))
            .returning();
        return updated ?? null;
    },

    async delete(id: string): Promise<void> {
        await db.delete(products).where(eq(products.id, id));
    }
};

export type ProductRepository = typeof productRepository;
