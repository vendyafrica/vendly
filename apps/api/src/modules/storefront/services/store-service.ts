import { storeRepository, type StoreRepository } from "../repositories/store-repository";

export class StoreService {
    constructor(
        private storeRepo: StoreRepository = storeRepository
    ) { }

    async createStore(input: {
        tenantId: string;
        name: string;
        slug: string;
    }) {
        // 1. Validate slug
        const existing = await this.storeRepo.findBySlug(input.slug);
        if (existing) {
            throw new Error(`Store with slug '${input.slug}' already exists`);
        }

        // 2. Create store
        const store = await this.storeRepo.create({
            tenantId: input.tenantId,
            name: input.name,
            slug: input.slug,
            sanityStoreId: input.slug, // Map sanityStoreId to slug by default
            sanityDesignSystem: "design-system-modern", // Default design system
            status: "draft",
        });

        // 3. Create default Sanity content
        try {
            const { createDefaultStoreContent } = await import('@vendly/sanity'); // Dynamic import to avoid build cyclic issues if any, or standard import
            await createDefaultStoreContent({
                storeSlug: store.slug,
                storeName: store.name
            });
        } catch (error) {
            console.error('Failed to create default store content:', error);
            // Non-fatal? Or should we rollback? For MVP non-fatal but log it.
        }

        return store;
    }

    async getStoreBySlug(slug: string) {
        return this.storeRepo.findBySlug(slug);
    }

    async getStoreById(id: string) {
        return this.storeRepo.findById(id);
    }
}

export const storeService = new StoreService();
