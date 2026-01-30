import { db } from "@vendly/db/db";
import { stores, categories } from "@vendly/db/schema";
import { eq } from "drizzle-orm";

export interface StoreWithCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    categories: string[];
}

export const marketplaceService = {
    /**
     * Get all active stores with their categories
     */
    async getAllStores(): Promise<StoreWithCategory[]> {
        const allStores = await db
            .select({
                id: stores.id,
                name: stores.name,
                slug: stores.slug,
                description: stores.description,
                categories: stores.categories,
            })
            .from(stores)
            .where(eq(stores.status, true));

        return allStores.map(store => ({
            ...store,
            categories: store.categories || [],
        }));
    },

    /**
     * Get stores grouped by category
     */
    async getStoresByCategory(): Promise<Record<string, StoreWithCategory[]>> {
        const allStores = await this.getAllStores();
        const storesByCategory: Record<string, StoreWithCategory[]> = {};

        for (const store of allStores) {
            for (const category of store.categories) {
                if (!storesByCategory[category]) {
                    storesByCategory[category] = [];
                }
                storesByCategory[category].push(store);
            }
        }

        return storesByCategory;
    },

    /**
     * Get stores for a specific category
     */
    async getStoresBySpecificCategory(categorySlug: string): Promise<StoreWithCategory[]> {
        // First get the category to find its name
        const category = await db.query.categories.findFirst({
            where: eq(categories.slug, categorySlug),
        });

        if (!category) {
            return [];
        }

        const allStores = await this.getAllStores();
        return allStores.filter(store =>
            store.categories.includes(category.name)
        );
    },
};
