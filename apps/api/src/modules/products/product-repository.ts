import { db } from "@vendly/db/db";
import {
    products,
    type Product,
    type NewProduct,
} from "@vendly/db/schema";
import { eq, and, desc, sql, like, or } from "drizzle-orm";
import type { ProductFilters } from "./product-models";

export class ProductRepository {
    /**
     * Create a new product
     */
    async create(product: NewProduct): Promise<Product> {
        const [created] = await db.insert(products).values(product).returning();
        return created;
    }

    /**
     * Find product by ID with tenant check
     */
    async findById(id: string, tenantId: string): Promise<Product | null> {
        const [product] = await db
            .select()
            .from(products)
            .where(and(eq(products.id, id), eq(products.tenantId, tenantId)))
            .limit(1);

        return product || null;
    }

    /**
     * Find products by tenant with filters and pagination
     */
    async findByTenant(
        tenantId: string,
        filters: ProductFilters
    ): Promise<{ products: Product[]; total: number }> {
        const conditions = [eq(products.tenantId, tenantId)];

        // Apply filters
        if (filters.storeId) {
            conditions.push(eq(products.storeId, filters.storeId));
        }

        if (filters.source) {
            conditions.push(eq(products.source, filters.source));
        }

        if (filters.isFeatured !== undefined) {
            conditions.push(eq(products.isFeatured, filters.isFeatured));
        }

        if (filters.search) {
            conditions.push(
                or(
                    like(products.title, `%${filters.search}%`),
                    like(products.description, `%${filters.search}%`)
                )!
            );
        }

        // Get total count
        const [{ count }] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(products)
            .where(and(...conditions));

        // Get paginated results
        const offset = (filters.page - 1) * filters.limit;
        const results = await db
            .select()
            .from(products)
            .where(and(...conditions))
            .orderBy(desc(products.createdAt))
            .limit(filters.limit)
            .offset(offset);

        return {
            products: results,
            total: count,
        };
    }

    /**
     * Update product
     */
    async update(
        id: string,
        tenantId: string,
        data: Partial<NewProduct>
    ): Promise<Product | null> {
        const [updated] = await db
            .update(products)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(products.id, id), eq(products.tenantId, tenantId)))
            .returning();

        return updated || null;
    }

    /**
     * Soft delete product
     */
    async delete(id: string, tenantId: string): Promise<boolean> {
        const [deleted] = await db
            .update(products)
            .set({ deletedAt: new Date() })
            .where(and(eq(products.id, id), eq(products.tenantId, tenantId)))
            .returning();

        return !!deleted;
    }

    /**
     * Bulk create products
     */
    async bulkCreate(productList: NewProduct[]): Promise<Product[]> {
        if (productList.length === 0) return [];

        const created = await db
            .insert(products)
            .values(productList)
            .returning();

        return created;
    }

    /**
     * Check if product exists by source ID
     */
    async existsBySourceId(
        tenantId: string,
        source: string,
        sourceId: string
    ): Promise<boolean> {
        const [product] = await db
            .select({ id: products.id })
            .from(products)
            .where(
                and(
                    eq(products.tenantId, tenantId),
                    eq(products.source, source),
                    eq(products.sourceId, sourceId)
                )
            )
            .limit(1);

        return !!product;
    }
}

export const productRepository = new ProductRepository();
