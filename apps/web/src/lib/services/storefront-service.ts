import { db, stores, products, eq, and, isNull, instagramAccounts } from "@vendly/db";

/**
 * Storefront Service for serverless environment
 * Handles public store data queries (no auth required)
 */
export const storefrontService = {
    /**
     * Find store by slug
     */
    async findStoreBySlug(slug: string) {
        const store = await db.query.stores.findFirst({
            where: and(eq(stores.slug, slug), isNull(stores.deletedAt)),
        });

        if (!store) return undefined;

        const igAccount = await db.query.instagramAccounts.findFirst({
            where: and(eq(instagramAccounts.tenantId, store.tenantId), eq(instagramAccounts.isActive, true))
        });

        if (igAccount?.profilePictureUrl) {
            return { ...store, logoUrl: igAccount.profilePictureUrl };
        }

        return store;
    },

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
    },

    /**
     * Get a single product by slug for a store
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
};
