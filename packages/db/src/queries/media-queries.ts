import { eq, and, desc } from "drizzle-orm";
import { mediaObjects, productMedia, products, tenants } from "@vendly/db/schema";
import { edgeDb } from "../db";

export class MediaQueries {
    constructor(private db: typeof edgeDb) {}

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

    /**
     * Get tenant by ID
     */
    async getTenantById(tenantId: string) {
        const [tenant] = await this.db
            .select()
            .from(tenants)
            .where(eq(tenants.id, tenantId))
            .limit(1);

        return tenant || null;
    }

    /**
     * Create media object
     */
    async createMediaObject(data: {
        tenantId: string;
        blobUrl: string;
        blobPathname?: string;
        contentType?: string;
        sizeBytes?: number;
        width?: number;
        height?: number;
        altText?: string;
        isPublic?: boolean;
        source?: string;
    }) {
        const [mediaObject] = await this.db
            .insert(mediaObjects)
            .values({
                tenantId: data.tenantId,
                blobUrl: data.blobUrl,
                blobPathname: data.blobPathname || null,
                contentType: data.contentType || null,
                sizeBytes: data.sizeBytes || null,
                width: data.width || null,
                height: data.height || null,
                altText: data.altText || null,
                isPublic: data.isPublic ?? true,
                source: data.source || null,
            })
            .returning();

        return mediaObject;
    }

    /**
     * Get media object by ID
     */
    async getMediaObjectById(id: string) {
        const [media] = await this.db
            .select()
            .from(mediaObjects)
            .where(eq(mediaObjects.id, id))
            .limit(1);

        return media || null;
    }

    /**
     * Get media object by blob pathname
     */
    async getMediaObjectByPathname(pathname: string) {
        const [media] = await this.db
            .select()
            .from(mediaObjects)
            .where(eq(mediaObjects.blobPathname, pathname))
            .limit(1);

        return media || null;
    }

    /**
     * List media objects for tenant
     */
    async listMediaByTenant(
        tenantId: string,
        options?: {
            limit?: number;
            offset?: number;
            source?: string;
        }
    ) {
        const conditions = [eq(mediaObjects.tenantId, tenantId)];
        
        if (options?.source) {
            conditions.push(eq(mediaObjects.source, options.source));
        }

        let query = this.db
            .select()
            .from(mediaObjects)
            .where(and(...conditions))
            .orderBy(desc(mediaObjects.createdAt));

        if (options?.limit) {
            query = query.limit(options.limit);
        }

        if (options?.offset) {
            query = query.offset(options.offset);
        }

        return await query;
    }

    /**
     * Update media object
     */
    async updateMediaObject(
        id: string,
        data: {
            altText?: string;
            width?: number;
            height?: number;
            isPublic?: boolean;
        }
    ) {
        const [updated] = await this.db
            .update(mediaObjects)
            .set(data)
            .where(eq(mediaObjects.id, id))
            .returning();

        return updated;
    }

    /**
     * Delete media object
     */
    async deleteMediaObject(id: string) {
        const [deleted] = await this.db
            .delete(mediaObjects)
            .where(eq(mediaObjects.id, id))
            .returning();

        return deleted;
    }

    /**
     * Get media count for tenant
     */
    async getMediaCountForTenant(tenantId: string) {
        const result = await this.db
            .select()
            .from(mediaObjects)
            .where(eq(mediaObjects.tenantId, tenantId));

        return result.length;
    }

    /**
     * Get total storage size for tenant
     */
    async getTotalStorageSizeForTenant(tenantId: string) {
        const media = await this.db
            .select({ sizeBytes: mediaObjects.sizeBytes })
            .from(mediaObjects)
            .where(eq(mediaObjects.tenantId, tenantId));

        return media.reduce((total, item) => total + (item.sizeBytes || 0), 0);
    }

    /**
     * Link media to product
     */
    async linkMediaToProduct(data: {
        tenantId: string;
        productId: string;
        mediaId: string;
        variantId?: string | null;
        sortOrder?: number;
        isFeatured?: boolean;
    }) {
        const [productMediaLink] = await this.db
            .insert(productMedia)
            .values({
                tenantId: data.tenantId,
                productId: data.productId,
                mediaId: data.mediaId,
                variantId: data.variantId || null,
                sortOrder: data.sortOrder || 0,
                isFeatured: data.isFeatured || false,
            })
            .returning();

        return productMediaLink;
    }

    /**
     * Get product media
     */
    async getProductMedia(productId: string) {
        return await this.db
            .select()
            .from(productMedia)
            .where(eq(productMedia.productId, productId))
            .orderBy(productMedia.sortOrder);
    }

    /**
     * Get featured media for product
     */
    async getFeaturedMediaForProduct(productId: string) {
        const [media] = await this.db
            .select()
            .from(productMedia)
            .where(
                and(
                    eq(productMedia.productId, productId),
                    eq(productMedia.isFeatured, true)
                )
            )
            .limit(1);

        return media || null;
    }

    /**
     * Update product media sort order
     */
    async updateProductMediaSortOrder(id: string, sortOrder: number) {
        const [updated] = await this.db
            .update(productMedia)
            .set({ sortOrder })
            .where(eq(productMedia.id, id))
            .returning();

        return updated;
    }

    /**
     * Set featured media for product
     */
    async setFeaturedMedia(productId: string, mediaId: string) {
        // First, unfeatured all media for this product
        await this.db
            .update(productMedia)
            .set({ isFeatured: false })
            .where(eq(productMedia.productId, productId));

        // Then set the new featured media
        const [updated] = await this.db
            .update(productMedia)
            .set({ isFeatured: true })
            .where(
                and(
                    eq(productMedia.productId, productId),
                    eq(productMedia.mediaId, mediaId)
                )
            )
            .returning();

        return updated;
    }

    /**
     * Unlink media from product
     */
    async unlinkMediaFromProduct(productMediaId: string) {
        const [deleted] = await this.db
            .delete(productMedia)
            .where(eq(productMedia.id, productMediaId))
            .returning();

        return deleted;
    }

    /**
     * Get all products using a media object
     */
    async getProductsUsingMedia(mediaId: string) {
        const links = await this.db
            .select()
            .from(productMedia)
            .where(eq(productMedia.mediaId, mediaId));

        if (links.length === 0) return [];

        const productIds = links.map((link) => link.productId);
        
        // Get unique product IDs
        const uniqueProductIds = [...new Set(productIds)];

        // Fetch products
        const productsList = await this.db
            .select()
            .from(products)
            .where(eq(products.id, uniqueProductIds[0])); // TODO: Use IN operator

        return productsList;
    }

    /**
     * Create multiple media objects
     */
    async createMultipleMediaObjects(
        data: Array<{
            tenantId: string;
            blobUrl: string;
            blobPathname?: string;
            contentType?: string;
            sizeBytes?: number;
            source?: string;
        }>
    ) {
        const created = await this.db.insert(mediaObjects).values(data).returning();
        return created;
    }

    /**
     * Delete multiple media objects
     */
    async deleteMultipleMediaObjects(ids: string[]) {
        // Note: This is a simplified version. In production, use proper IN clause
        const deleted = [];
        for (const id of ids) {
            const result = await this.deleteMediaObject(id);
            if (result) deleted.push(result);
        }
        return deleted;
    }
}

/**
 * Create media queries instance
 */
export function createMediaQueries(db: DbClient) {
    return new MediaQueries(db);
}