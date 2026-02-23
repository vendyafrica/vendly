import { db, stores, products, eq, and, isNull, instagramAccounts, inArray } from "@vendly/db";
import { cache } from "react";

/**
 * Storefront Service for serverless environment
 * Handles public store data queries (no auth required)
 */

const findStoreBySlugCached = cache(async (slug: string) => {
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
});

function slugifyName(name: string): string {
    return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function resolveProductSlug(product: { slug: string | null; productName: string }): string {
    return product.slug || slugifyName(product.productName || "");
}

export const storefrontService = {
    /**
     * Find store by slug
     */
    async findStoreBySlug(slug: string) {
        return findStoreBySlugCached(slug);
    },

    /**
     * Get all products for a store
     */
    async getStoreProducts(storeId: string, query?: string) {
        const normalizedQuery = query?.trim().toLowerCase() || "";

        const productsForStore = await db.query.products.findMany({
            where: and(
                eq(products.storeId, storeId),
                eq(products.status, "active"),
                isNull(products.deletedAt)
            ),
            columns: {
                id: true,
                slug: true,
                productName: true,
                description: true,
                priceAmount: true,
                currency: true,
            },
            with: {
                media: {
                    with: { media: true },
                    orderBy: (media, { asc }) => [asc(media.sortOrder)],
                    limit: 1,
                },
            },
        });

        const filtered = normalizedQuery
            ? productsForStore.filter((product) => product.productName?.toLowerCase().includes(normalizedQuery))
            : productsForStore;

        return filtered;
    },

    /**
     * Get a single product by slug for a store
     */
    async getStoreProductBySlug(storeId: string, productSlug: string) {
        const bySlug = await db.query.products.findFirst({
            where: and(
                eq(products.storeId, storeId),
                eq(products.status, "active"),
                isNull(products.deletedAt),
                eq(products.slug, productSlug)
            ),
            with: {
                media: {
                    with: { media: true },
                    orderBy: (media, { asc }) => [asc(media.sortOrder)],
                },
            },
        });

        if (bySlug) return bySlug;

        const fallbackProducts = await db.query.products.findMany({
            where: and(
                eq(products.storeId, storeId),
                eq(products.status, "active"),
                isNull(products.deletedAt)
            ),
            columns: {
                id: true,
                slug: true,
                productName: true,
                description: true,
                priceAmount: true,
                currency: true,
            },
            with: {
                media: {
                    with: { media: true },
                    orderBy: (media, { asc }) => [asc(media.sortOrder)],
                },
            },
        });

        return fallbackProducts.find((product) => resolveProductSlug(product) === productSlug);
    },

    async getStoreProductsByCategorySlug(storeId: string, categorySlug: string, query?: string) {
        const normalizedQuery = query?.trim().toLowerCase() || "";
        const { productCategories, categories } = await import("@vendly/db");

        const matches = await db
            .select({ id: products.id })
            .from(products)
            .innerJoin(productCategories, eq(productCategories.productId, products.id))
            .innerJoin(categories, eq(categories.id, productCategories.categoryId))
            .where(
                and(
                    eq(products.storeId, storeId),
                    eq(products.status, "active"),
                    isNull(products.deletedAt),
                    eq(categories.slug, categorySlug)
                )
            );

        const ids = matches.map((match) => match.id);
        if (ids.length === 0) return [];

        const productsForStore = await db.query.products.findMany({
            where: and(inArray(products.id, ids), eq(products.status, "active"), isNull(products.deletedAt)),
            columns: {
                id: true,
                slug: true,
                productName: true,
                description: true,
                priceAmount: true,
                currency: true,
            },
            with: {
                media: {
                    with: { media: true },
                    orderBy: (media, { asc }) => [asc(media.sortOrder)],
                    limit: 1,
                },
            },
        });

        const filtered = normalizedQuery
            ? productsForStore.filter((product) => product.productName?.toLowerCase().includes(normalizedQuery))
            : productsForStore;

        return filtered;
    }
};
