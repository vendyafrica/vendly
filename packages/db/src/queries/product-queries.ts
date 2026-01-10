import { eq, and, desc, asc, isNull } from "drizzle-orm";
import {
    products,
    productVariants,
    productImages,
    productMedia,
    productCategories,
    inventoryItems,
    stores,
    tenants,
    mediaObjects,
} from "@vendly/db/schema";
import { edgeDb } from "../db";

export class ProductQueries {
    constructor(private db: typeof edgeDb) {}

    /**
     * Create product
     */
    async createProduct(data: {
        tenantId: string;
        storeId: string;
        title: string;
        description?: string | null;
        basePriceAmount: number;
        baseCurrency?: string;
        status?: "draft" | "active" | "archived";
        compareAtPrice?: number | null;
        hasVariants?: boolean;
    }) {
        const [product] = await this.db
            .insert(products)
            .values({
                tenantId: data.tenantId,
                storeId: data.storeId,
                title: data.title,
                description: data.description || null,
                basePriceAmount: data.basePriceAmount,
                baseCurrency: data.baseCurrency || "KES",
                status: data.status || "draft",
                compareAtPrice: data.compareAtPrice || null,
                hasVariants: data.hasVariants || false,
            })
            .returning();

        return product;
    }

    /**
     * Get product by ID
     */
    async getProductById(productId: string) {
        const [product] = await this.db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        return product || null;
    }

    /**
     * Get product with images
     */
    async getProductWithImages(productId: string) {
        const product = await this.getProductById(productId);
        if (!product) return null;

        const images = await this.db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, productId))
            .orderBy(asc(productImages.sortOrder));

        return {
            ...product,
            images,
        };
    }

    /**
     * List products for store
     */
    async listProductsByStore(
        storeId: string,
        options?: {
            status?: "draft" | "active" | "archived";
            limit?: number;
            offset?: number;
        }
    ) {
        let query = this.db
            .select()
            .from(products)
            .where(and(eq(products.storeId, storeId), isNull(products.deletedAt)));

        if (options?.status) {
            query = query.where(eq(products.status, options.status)) as any;
        }

        query = query.orderBy(desc(products.createdAt)) as any;

        if (options?.limit) {
            query = query.limit(options.limit) as any;
        }

        if (options?.offset) {
            query = query.offset(options.offset) as any;
        }

        return await query;
    }

    /**
     * List products for store with media URLs.
     * Prefers product_media -> media_objects, but also returns legacy product_images.
     */
    async listProductsByStoreWithMedia(
        storeId: string,
        options?: {
            status?: "draft" | "active" | "archived";
            limit?: number;
            offset?: number;
        }
    ) {
        const productList = await this.listProductsByStore(storeId, options);

        const results = [] as Array<
            (typeof products.$inferSelect) & {
                mediaUrls: string[];
                images: Array<typeof productImages.$inferSelect>;
            }
        >;

        for (const product of productList) {
            const images = await this.getProductImages(product.id);

            const mediaLinks = await this.db
                .select({
                    url: mediaObjects.blobUrl,
                    sortOrder: productMedia.sortOrder,
                    isFeatured: productMedia.isFeatured,
                })
                .from(productMedia)
                .innerJoin(mediaObjects, eq(productMedia.mediaId, mediaObjects.id))
                .where(eq(productMedia.productId, product.id))
                .orderBy(asc(productMedia.sortOrder));

            const mediaUrls = mediaLinks.map((m) => m.url);
            const legacyUrls = images.map((img) => img.url);

            results.push({
                ...product,
                images,
                mediaUrls: mediaUrls.length > 0 ? mediaUrls : legacyUrls,
            });
        }

        return results;
    }

    /**
     * Update product
     */
    async updateProduct(
        productId: string,
        data: {
            title?: string;
            description?: string | null;
            basePriceAmount?: number;
            status?: "draft" | "active" | "archived";
            compareAtPrice?: number | null;
        }
    ) {
        const [updated] = await this.db
            .update(products)
            .set(data)
            .where(eq(products.id, productId))
            .returning();

        return updated;
    }

    /**
     * Delete product (soft delete)
     */
    async deleteProduct(productId: string) {
        const [deleted] = await this.db
            .update(products)
            .set({ deletedAt: new Date() })
            .where(eq(products.id, productId))
            .returning();

        return deleted;
    }

    /**
     * Permanently delete product
     */
    async permanentlyDeleteProduct(productId: string) {
        const [deleted] = await this.db
            .delete(products)
            .where(eq(products.id, productId))
            .returning();

        return deleted;
    }

    /**
     * Get product count for store
     */
    async getProductCountForStore(storeId: string, status?: "draft" | "active" | "archived") {
        let query = this.db
            .select()
            .from(products)
            .where(and(eq(products.storeId, storeId), isNull(products.deletedAt)));

        if (status) {
            query = query.where(eq(products.status, status)) as any;
        }

        const result = await query;
        return result.length;
    }

    /**
     * Create product variant
     */
    async createVariant(data: {
        tenantId: string;
        productId: string;
        sku?: string | null;
        title?: string | null;
        priceAmount: number;
        currency?: string;
        compareAtPrice?: number | null;
        options?: any;
        sortOrder?: number;
    }) {
        const [variant] = await this.db
            .insert(productVariants)
            .values({
                tenantId: data.tenantId,
                productId: data.productId,
                sku: data.sku || null,
                title: data.title || null,
                priceAmount: data.priceAmount,
                currency: data.currency || "KES",
                compareAtPrice: data.compareAtPrice || null,
                options: data.options || null,
                sortOrder: data.sortOrder || 0,
            })
            .returning();

        return variant;
    }

    /**
     * Get variants for product
     */
    async getVariantsByProduct(productId: string) {
        return await this.db
            .select()
            .from(productVariants)
            .where(eq(productVariants.productId, productId))
            .orderBy(asc(productVariants.sortOrder));
    }

    /**
     * Get variant by ID
     */
    async getVariantById(variantId: string) {
        const [variant] = await this.db
            .select()
            .from(productVariants)
            .where(eq(productVariants.id, variantId))
            .limit(1);

        return variant || null;
    }

    /**
     * Update variant
     */
    async updateVariant(
        variantId: string,
        data: {
            title?: string;
            priceAmount?: number;
            compareAtPrice?: number | null;
            isActive?: boolean;
        }
    ) {
        const [updated] = await this.db
            .update(productVariants)
            .set(data)
            .where(eq(productVariants.id, variantId))
            .returning();

        return updated;
    }

    /**
     * Add product image
     */
    async addProductImage(data: {
        productId: string;
        url: string;
        sortOrder?: number;
    }) {
        const [image] = await this.db
            .insert(productImages)
            .values({
                productId: data.productId,
                url: data.url,
                sortOrder: data.sortOrder || 0,
            })
            .returning();

        return image;
    }

    /**
     * Get product images
     */
    async getProductImages(productId: string) {
        return await this.db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, productId))
            .orderBy(asc(productImages.sortOrder));
    }

    /**
     * Update image sort order
     */
    async updateImageSortOrder(imageId: string, sortOrder: number) {
        const [updated] = await this.db
            .update(productImages)
            .set({ sortOrder })
            .where(eq(productImages.id, imageId))
            .returning();

        return updated;
    }

    /**
     * Delete product image
     */
    async deleteProductImage(imageId: string) {
        const [deleted] = await this.db
            .delete(productImages)
            .where(eq(productImages.id, imageId))
            .returning();

        return deleted;
    }

    /**
     * Add product to category
     */
    async addProductToCategory(productId: string, categoryId: string) {
        const [link] = await this.db
            .insert(productCategories)
            .values({
                productId,
                categoryId,
            })
            .returning();

        return link;
    }

    /**
     * Remove product from category
     */
    async removeProductFromCategory(productId: string, categoryId: string) {
        await this.db
            .delete(productCategories)
            .where(
                and(
                    eq(productCategories.productId, productId),
                    eq(productCategories.categoryId, categoryId)
                )
            );
    }

    /**
     * Get categories for product
     */
    async getProductCategories(productId: string) {
        return await this.db
            .select()
            .from(productCategories)
            .where(eq(productCategories.productId, productId));
    }

    /**
     * Get inventory for variant
     */
    async getInventoryForVariant(variantId: string) {
        const [inventory] = await this.db
            .select()
            .from(inventoryItems)
            .where(eq(inventoryItems.variantId, variantId))
            .limit(1);

        return inventory || null;
    }

    /**
     * Update inventory
     */
    async updateInventory(
        variantId: string,
        data: {
            quantityOnHand?: number;
            quantityReserved?: number;
            trackInventory?: boolean;
        }
    ) {
        const [updated] = await this.db
            .update(inventoryItems)
            .set(data)
            .where(eq(inventoryItems.variantId, variantId))
            .returning();

        return updated;
    }

    /**
     * Get store by slug
     */
    async getStoreBySlug(tenantId: string, storeSlug: string) {
        const [store] = await this.db
            .select()
            .from(stores)
            .where(and(eq(stores.tenantId, tenantId), eq(stores.slug, storeSlug)))
            .limit(1);

        return store || null;
    }

    /**
     * Get tenant by slug
     */
    async getTenantBySlug(tenantSlug: string) {
        const [tenant] = await this.db
            .select()
            .from(tenants)
            .where(eq(tenants.slug, tenantSlug))
            .limit(1);

        return tenant || null;
    }
}

/**
 * Create product queries instance
 */
export function createProductQueries(db: typeof edgeDb) {
    return new ProductQueries(db);
}