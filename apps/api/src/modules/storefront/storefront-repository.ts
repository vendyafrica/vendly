import { db } from "@vendly/db/db";
import { stores, products, productMedia, mediaObjects } from "@vendly/db/schema";
import { eq, and, isNull } from "drizzle-orm";

class StorefrontRepository {
    /**
     * Find store by slug
     */
    async findStoreBySlug(slug: string) {
        return db.query.stores.findFirst({
            where: and(eq(stores.slug, slug), isNull(stores.deletedAt)),
        });
    }

    /**
     * Get all products for a store
     */
    async getStoreProducts(storeId: string) {
        return db.query.products.findMany({
            where: and(
                eq(products.storeId, storeId),
                eq(products.status, "active"),
                isNull(products.deletedAt)
            ),
            with: {
                media: {
                    with: { media: true },
                    orderBy: (media, { asc }) => [asc(media.sortOrder)],
                    limit: 1,
                },
            },
        });
    }

    /**
     * Get a single product by slug for a store
     * We generate the slug from the product name, so we need to fetch all products and filter
     */
    async getStoreProductBySlug(storeId: string, productSlug: string) {
        const allProducts = await db.query.products.findMany({
            where: and(
                eq(products.storeId, storeId),
                eq(products.status, "active"),
                isNull(products.deletedAt)
            ),
            with: {
                media: {
                    with: { media: true },
                    orderBy: (media, { asc }) => [asc(media.sortOrder)],
                },
            },
        });

        // Find product where the slugified name matches
        return allProducts.find(
            (p) => p.productName.toLowerCase().replace(/\s+/g, "-") === productSlug
        );
    }
}

export const storefrontRepository = new StorefrontRepository();
