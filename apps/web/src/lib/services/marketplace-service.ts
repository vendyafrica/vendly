import { categoryRepo } from "../data/category-repo";
import { storeRepo } from "../data/store-repo";
import { withCache, cacheKeys, TTL } from "@vendly/db";

export interface StoreWithCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl?: string | null;
    instagramAvatarUrl?: string | null;
    categories: string[];
    heroMedia?: string | null;
    heroMediaType?: "image" | "video" | null;
    heroMediaItems?: Array<{ url: string; type: "image" | "video" }>;
    images?: string[];
}

function slugifyName(name: string): string {
    return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function mapProductRecord(product: any, store: { id: string; name: string; slug: string; logoUrl?: string | null }) {
    const slug = product.slug || slugifyName(product.productName || "");
    const description = product.description as string | null | undefined;
    const priceAmount = Number(product.priceAmount || 0);
    const mediaList = Array.isArray(product.media) ? product.media : [];
    const images = mediaList
        .map((m: any) => m?.media?.url || m?.media?.blobUrl)
        .filter(Boolean) as string[];

    return {
        id: product.id,
        slug,
        name: product.productName,
        description,
        price: priceAmount,
        currency: product.currency,
        images,
        rating: 4.5, // Placeholder
        store: {
            id: store.id,
            name: store.name,
            slug: store.slug,
            logoUrl: store.logoUrl ?? null,
        },
    };
}

export interface MarketplaceSearchResult {
    stores: Array<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        categories: string[];
    }>;
    products: Array<{
        id: string;
        name: string;
        slug: string;
        price: number;
        currency: string;
        image: string | null;
        store: { slug: string; name: string } | null;
    }>;
}

function parseHeroMediaItems(input: unknown): Array<{ url: string; type: "image" | "video" }> {
    if (!Array.isArray(input)) return [];
    return input
        .map((i) => {
            if (!i || typeof i !== "object") return null;
            const url = (i as { url?: unknown }).url;
            const type = (i as { type?: unknown }).type;
            if (typeof url !== "string") return null;
            if (type !== "image" && type !== "video") return null;
            return { url, type };
        })
        .filter((x): x is { url: string; type: "image" | "video" } => Boolean(x));
}

/**
 * Batch fetch product images for multiple stores to avoid N+1 queries
 */
async function batchFetchStoreProductImages(storeIds: string[]): Promise<Map<string, string[]>> {
    if (storeIds.length === 0) return new Map();

    const { db, products, inArray } = await import("@vendly/db");

    // Fetch all products with media for the given stores in one query
    const productsWithMedia = await db.query.products.findMany({
        where: inArray(products.storeId, storeIds),
        columns: { id: true, storeId: true },
        with: {
            media: {
                limit: 5,
                with: {
                    media: {
                        columns: { blobUrl: true }
                    }
                }
            }
        }
    });

    // Group images by store
    const storeImages = new Map<string, string[]>();
    for (const product of productsWithMedia) {
        const existingImages = storeImages.get(product.storeId) || [];
        const productImages = (product.media ?? [])
            .map((m: any) => m?.media?.blobUrl)
            .filter(Boolean);

        // Limit to 5 images per store
        const combined = [...existingImages, ...productImages].slice(0, 5);
        storeImages.set(product.storeId, combined);
    }

    return storeImages;
}

export const marketplaceService = {
    /**
     * Get all active stores with their categories
     * Uses caching with 5-minute TTL
     */
    async getAllStores(): Promise<StoreWithCategory[]> {
        return withCache(
            cacheKeys.marketplace.homepage(),
            async () => {
                const stores = await storeRepo.findActiveStores();

                // Fetch Instagram accounts to get profile pictures
                const { db, instagramAccounts, eq } = await import("@vendly/db");
                const igAccounts = await db
                    .select({
                        tenantId: instagramAccounts.tenantId,
                        profilePictureUrl: instagramAccounts.profilePictureUrl
                    })
                    .from(instagramAccounts)
                    .where(eq(instagramAccounts.isActive, true));

                const igMap = new Map(igAccounts.map(ig => [ig.tenantId, ig.profilePictureUrl]));

                // Collect stores that need product images (no hero images)
                const storesNeedingImages: string[] = [];
                const storeHeroImages = new Map<string, string[]>();

                for (const store of stores) {
                    const heroMediaItems = parseHeroMediaItems((store as { heroMediaItems?: unknown }).heroMediaItems);
                    const heroImages = heroMediaItems
                        .filter((i) => i.type === "image")
                        .map((i) => i.url);

                    if (heroImages.length > 0) {
                        storeHeroImages.set(store.id, heroImages);
                    } else {
                        storesNeedingImages.push(store.id);
                    }
                }

                // Batch fetch product images for stores without hero images
                const productImages = await batchFetchStoreProductImages(storesNeedingImages);

                return stores.map((store) => {
                    const heroMediaItems = parseHeroMediaItems((store as { heroMediaItems?: unknown }).heroMediaItems);
                    const images = storeHeroImages.get(store.id) || productImages.get(store.id) || [];

                    return {
                        id: store.id,
                        name: store.name,
                        slug: store.slug,
                        description: store.description,
                        logoUrl: store.logoUrl ?? null,
                        instagramAvatarUrl: igMap.get(store.tenantId) ?? null,
                        categories: store.categories || [],
                        heroMedia: store.heroMedia,
                        heroMediaType: store.heroMediaType as "image" | "video" | null,
                        heroMediaItems,
                        images,
                    };
                });
            },
            TTL.MEDIUM // 5 minutes
        );
    },


    /**
     * Get stores grouped by category
     * Note: This is still doing some in-memory grouping which is fine for the home page 
     * if the number of stores is reasonable. For high scale, we'd paginate or query differently.
     */
    async getHomePageData() {
        const categories = await categoryRepo.findAll();
        const stores = await this.getAllStores();

        const storesByCategory: Record<string, StoreWithCategory[]> = {};

        // Pre-fill categories to ensure specific order if needed, or just let them fill naturally
        // For now, adhering to the requested flow of "All store categories... Stores grouped by category"

        // Pivot stores to categories
        for (const store of stores) {
            for (const category of store.categories) {
                if (!storesByCategory[category]) {
                    storesByCategory[category] = [];
                }
                storesByCategory[category].push(store);
            }
        }

        return {
            categories,
            stores, // Expose flat list of stores
            storesByCategory
        };
    },

    /**
     * Get stores for a specific category
     */
    async getStoresBySpecificCategory(categorySlug: string): Promise<StoreWithCategory[]> {
        // First get the category to find its name to filter by name array
        const category = await categoryRepo.findBySlug(categorySlug);

        if (!category) {
            return [];
        }

        const stores = await storeRepo.findByCategory({ slug: category.slug, name: category.name });

        const { productRepo } = await import("../data/product-repo");

        return Promise.all(stores.map(async (store) => {
            const heroMediaItems = parseHeroMediaItems((store as { heroMediaItems?: unknown }).heroMediaItems);
            const heroImages = heroMediaItems
                .filter((i) => i.type === "image")
                .map((i) => i.url);

            let images: string[] = heroImages;

            if (images.length === 0) {
                const products = await productRepo.findByStoreId(store.id);
                images = products
                    .flatMap((p: any) =>
                        (p.media ?? [])
                            .map((m: any) => m?.media?.blobUrl ?? m?.media?.url ?? null)
                            .filter(Boolean)
                    )
                    .slice(0, 5);
            }

            return {
                id: store.id,
                name: store.name,
                slug: store.slug,
                description: store.description,
                logoUrl: store.logoUrl ?? null,
                categories: store.categories || [],
                heroMedia: store.heroMedia,
                heroMediaType: store.heroMediaType as "image" | "video" | null,
                heroMediaItems,
                images,
            };
        }));
    },

    async getStoreDetails(slug: string) {
        return withCache(
            cacheKeys.stores.bySlug(slug),
            async () => {
                const store = await storeRepo.findBySlug(slug);
                if (!store) return null;

                const heroMediaItems = parseHeroMediaItems((store as { heroMediaItems?: unknown }).heroMediaItems);

                return {
                    id: store.id,
                    name: store.name,
                    slug: store.slug,
                    description: store.description,
                    logoUrl: store.logoUrl ?? null,
                    rating: store.storeRating || 4.5,
                    ratingCount: store.storeRatingCount || 100,
                    heroMedia: store.heroMedia,
                    heroMediaType: store.heroMediaType as "image" | "video" | null,
                    heroMediaItems,
                };
            },
            TTL.MEDIUM
        );
    },


    async getStoreProducts(slug: string, query?: string) {
        const store = await storeRepo.findBySlug(slug);
        if (!store) return [];

        // Dynamic import to avoid circular dependency
        const { productRepo } = await import("../data/product-repo");
        const products = await productRepo.findByStoreId(store.id);

        const filtered = query
            ? products.filter((p: any) => p.productName?.toLowerCase().includes(query.toLowerCase()))
            : products;

        return filtered.map((p: any) => ({
            id: p.id,
            slug: p.slug || p.productName.toLowerCase().replace(/\s+/g, "-"),
            name: p.productName,
            price: Number(p.priceAmount || 0),
            currency: p.currency,
            // Extract first image from media relation if available
            image: p.media?.[0]?.media?.url || p.media?.[0]?.media?.blobUrl || null,
            rating: 4.5 // Placeholder
        }));
    },

    async getStoreProduct(storeSlug: string, productSlug: string) {
        const store = await storeRepo.findBySlug(storeSlug);
        if (!store) return null;

        const { productRepo } = await import("../data/product-repo");
        // Optimization: Ideally repo has findOneBySlug. For now, we fetch all and find. 
        // This mirrors storefrontService logic but we should improve repo later.
        const products = await productRepo.findByStoreId(store.id);

        const product = products.find((p: any) => {
            const slug = p.slug || p.productName.toLowerCase().replace(/\s+/g, "-");
            return slug === productSlug;
        });

        if (!product) return null;

        const styleGuideType = (product as { styleGuideType?: string }).styleGuideType;

        const mapped = mapProductRecord(product, store);

        return {
            ...mapped,
            styleGuideEnabled: Boolean((product as { styleGuideEnabled?: boolean }).styleGuideEnabled),
            styleGuideType: styleGuideType === "shoes" ? "shoes" : "clothes",
        };
    },

    async getStoreProductById(storeSlug: string, productId: string) {
        const store = await storeRepo.findBySlug(storeSlug);
        if (!store) return null;

        const { productRepo } = await import("../data/product-repo");
        const product = await productRepo.findById(productId);
        if (!product) return null;

        // Ensure product belongs to store and is active
        if (product.storeId !== store.id) return null;
        if ((product as { status?: string }).status && (product as { status?: string }).status !== "active") return null;

        const mapped = mapProductRecord(product, store);
        const styleGuideType = (product as { styleGuideType?: string }).styleGuideType;

        return {
            ...mapped,
            styleGuideEnabled: Boolean((product as { styleGuideEnabled?: boolean }).styleGuideEnabled),
            styleGuideType: styleGuideType === "shoes" ? "shoes" : "clothes",
        };
    },

    /**
     * Full marketplace text search (stores + products) by name/description (case-insensitive LIKE)
     */
    async searchMarketplace(query: string, options?: { storeLimit?: number; productLimit?: number; includeDescriptions?: boolean }): Promise<MarketplaceSearchResult> {
        const trimmed = query.trim();
        if (!trimmed) return { stores: [], products: [] };

        const storeLimit = options?.storeLimit ?? 12;
        const productLimit = options?.productLimit ?? 20;
        const includeDescriptions = options?.includeDescriptions ?? false;

        const pattern = `%${trimmed.toLowerCase()}%`;

        const { db, stores, products, isNull, and, or, eq, sql } = await import("@vendly/db");

        const buildLike = (column: any, coalesceEmpty = false) =>
            coalesceEmpty
                ? sql`lower(coalesce(${column}, '')) like ${pattern}`
                : sql`lower(${column}) like ${pattern}`;

        const storeWhere = includeDescriptions
            ? and(
                eq(stores.status, true),
                or(
                    buildLike(stores.name),
                    buildLike(stores.description, true)
                ),
                isNull(stores.deletedAt)
            )
            : and(
                eq(stores.status, true),
                buildLike(stores.name),
                isNull(stores.deletedAt)
            );

        const [storeResults, productResults] = await Promise.all([
            db.query.stores.findMany({
                where: storeWhere,
                limit: storeLimit,
            }),
            db.query.products.findMany({
                where: and(
                    eq(products.status, "active"),
                    buildLike(products.productName),
                    isNull(products.deletedAt)
                ),
                limit: productLimit,
                with: {
                    store: true,
                    media: {
                        with: { media: true },
                        orderBy: (media, { asc }) => [asc(media.sortOrder)],
                        limit: 1,
                    },
                },
            })
        ]);

        return {
            stores: storeResults.map((s) => ({
                id: s.id,
                name: s.name,
                slug: s.slug,
                description: s.description,
                logoUrl: s.logoUrl ?? null,
                categories: s.categories || [],
            })),
            products: productResults.map((p) => ({
                id: p.id,
                name: p.productName,
                slug: p.slug,
                price: Number(p.priceAmount ?? 0),
                currency: p.currency,
                image: p.media?.[0]?.media?.blobUrl || null,
                store: p.store ? { slug: p.store.slug, name: p.store.name } : null,
            })),
        };
    }
};
