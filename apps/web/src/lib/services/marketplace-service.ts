import { categoryRepo } from "../data/category-repo";
import { storeRepo } from "../data/store-repo";

export interface StoreWithCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    categories: string[];
    heroMedia?: string | null;
    heroMediaType?: "image" | "video" | null;
    heroMediaItems?: Array<{ url: string; type: "image" | "video" }>;
    images?: string[];
}

export const marketplaceService = {
    /**
     * Get all active stores with their categories
     */
    async getAllStores(): Promise<StoreWithCategory[]> {
        const stores = await storeRepo.findActiveStores();

        const { productRepo } = await import("../data/product-repo");

        return Promise.all(stores.map(async (store) => {
            const heroMediaItems = Array.isArray((store as any).heroMediaItems) ? (store as any).heroMediaItems : [];
            const heroImages = heroMediaItems
                .filter((i: any) => i && i.type === "image" && typeof i.url === "string")
                .map((i: any) => i.url);

            let images: string[] = heroImages;

            // Marketplace fallback: if no hero images, show up to 5 product images
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
            categories: store.categories || [],
            heroMedia: store.heroMedia,
            heroMediaType: store.heroMediaType as "image" | "video" | null,
            heroMediaItems,
            images,
            };
        }));
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

        const stores = await storeRepo.findByCategoryName(category.name);

        const { productRepo } = await import("../data/product-repo");

        return Promise.all(stores.map(async (store) => {
            const heroMediaItems = Array.isArray((store as any).heroMediaItems) ? (store as any).heroMediaItems : [];
            const heroImages = heroMediaItems
                .filter((i: any) => i && i.type === "image" && typeof i.url === "string")
                .map((i: any) => i.url);

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
            categories: store.categories || [],
            heroMedia: store.heroMedia,
            heroMediaType: store.heroMediaType as "image" | "video" | null,
            heroMediaItems,
            images,
            };
        }));
    },

    async getStoreDetails(slug: string) {
        const store = await storeRepo.findBySlug(slug);
        if (!store) return null;

        const heroMediaItems = Array.isArray((store as any).heroMediaItems) ? (store as any).heroMediaItems : [];

        return {
            id: store.id,
            name: store.name,
            slug: store.slug,
            description: store.description,
            // Assuming store has these fields or we map them. 
            // The repo returns the DB object. If media fields are missing in DB schema, we might need to adjust.
            // Based on Hero component, it expects rating, ratingCount, heroMedia.
            // These might not be in the basic store schema but let's pass what we have
            // and maybe fetch additional stats if needed.
            rating: store.storeRating || 4.5, // Use actual rating from DB if available
            ratingCount: store.storeRatingCount || 100, // Use actual rating count from DB
            heroMedia: store.heroMedia, // Use actual hero media from DB
            heroMediaType: store.heroMediaType as "image" | "video" | null,
            heroMediaItems,
        };
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

        return {
            id: product.id,
            slug: product.slug || product.productName.toLowerCase().replace(/\s+/g, "-"),
            name: product.productName,
            description: product.description, // Assuming description exists
            price: Number(product.priceAmount || 0),
            currency: product.currency,
            images: product.media?.map((m: any) => m.media?.url || m.media?.blobUrl).filter(Boolean) || [],
            rating: 4.5, // Placeholder
            styleGuideEnabled: Boolean((product as { styleGuideEnabled?: boolean }).styleGuideEnabled),
            styleGuideType: (product as { styleGuideType?: string }).styleGuideType ?? "clothes",
            store: {
                id: store.id,
                name: store.name,
                slug: store.slug
            }
        };
    }
};
