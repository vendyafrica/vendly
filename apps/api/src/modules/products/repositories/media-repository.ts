import { db } from "@vendly/db/db";
import {
    mediaObjects,
    productMedia,
    type MediaObject,
    type NewMediaObject,
    type ProductMedia,
    type NewProductMedia,
} from "@vendly/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export class MediaRepository {
    /**
     * Create a media object
     */
    async createMediaObject(media: NewMediaObject): Promise<MediaObject> {
        const [created] = await db
            .insert(mediaObjects)
            .values(media)
            .returning();
        return created;
    }

    /**
     * Bulk create media objects
     */
    async bulkCreateMediaObjects(
        mediaList: NewMediaObject[]
    ): Promise<MediaObject[]> {
        if (mediaList.length === 0) return [];

        const created = await db
            .insert(mediaObjects)
            .values(mediaList)
            .returning();

        return created;
    }

    /**
     * Create product-media link
     */
    async createProductMedia(link: NewProductMedia): Promise<ProductMedia> {
        const [created] = await db
            .insert(productMedia)
            .values(link)
            .returning();
        return created;
    }

    /**
     * Bulk create product-media links
     */
    async bulkCreateProductMedia(
        links: NewProductMedia[]
    ): Promise<ProductMedia[]> {
        if (links.length === 0) return [];

        const created = await db
            .insert(productMedia)
            .values(links)
            .returning();

        return created;
    }

    /**
     * Get all media for a product
     */
    async getProductMedia(productId: string): Promise<
        Array<
            MediaObject & {
                sortOrder: number;
                isFeatured: boolean;
            }
        >
    > {
        const results = await db
            .select({
                id: mediaObjects.id,
                tenantId: mediaObjects.tenantId,
                blobUrl: mediaObjects.blobUrl,
                blobPathname: mediaObjects.blobPathname,
                contentType: mediaObjects.contentType,
                source: mediaObjects.source,
                sourceMediaId: mediaObjects.sourceMediaId,
                sourceMetadata: mediaObjects.sourceMetadata,
                isPublic: mediaObjects.isPublic,
                lastSyncedAt: mediaObjects.lastSyncedAt,
                createdAt: mediaObjects.createdAt,
                updatedAt: mediaObjects.updatedAt,
                sortOrder: productMedia.sortOrder,
                isFeatured: productMedia.isFeatured,
            })
            .from(productMedia)
            .innerJoin(
                mediaObjects,
                eq(productMedia.mediaId, mediaObjects.id)
            )
            .where(eq(productMedia.productId, productId))
            .orderBy(productMedia.sortOrder);

        return results;
    }

    /**
     * Delete media object
     */
    async deleteMediaObject(
        mediaId: string,
        tenantId: string
    ): Promise<boolean> {
        const [deleted] = await db
            .delete(mediaObjects)
            .where(
                and(
                    eq(mediaObjects.id, mediaId),
                    eq(mediaObjects.tenantId, tenantId)
                )
            )
            .returning();

        return !!deleted;
    }

    /**
     * Delete product-media link
     */
    async deleteProductMedia(
        productId: string,
        mediaId: string
    ): Promise<boolean> {
        const [deleted] = await db
            .delete(productMedia)
            .where(
                and(
                    eq(productMedia.productId, productId),
                    eq(productMedia.mediaId, mediaId)
                )
            )
            .returning();

        return !!deleted;
    }

    /**
     * Delete all media links for a product
     */
    async deleteAllProductMedia(productId: string): Promise<number> {
        const deleted = await db
            .delete(productMedia)
            .where(eq(productMedia.productId, productId))
            .returning();

        return deleted.length;
    }

    /**
     * Find media object by blob pathname
     */
    async findByBlobPathname(
        pathname: string,
        tenantId: string
    ): Promise<MediaObject | null> {
        const [media] = await db
            .select()
            .from(mediaObjects)
            .where(
                and(
                    eq(mediaObjects.blobPathname, pathname),
                    eq(mediaObjects.tenantId, tenantId)
                )
            )
            .limit(1);

        return media || null;
    }

    /**
     * Find media by source ID (for Instagram)
     */
    async findBySourceId(
        tenantId: string,
        source: string,
        sourceMediaId: string
    ): Promise<MediaObject | null> {
        const [media] = await db
            .select()
            .from(mediaObjects)
            .where(
                and(
                    eq(mediaObjects.tenantId, tenantId),
                    eq(mediaObjects.source, source),
                    eq(mediaObjects.sourceMediaId, sourceMediaId)
                )
            )
            .limit(1);

        return media || null;
    }

    /**
     * Get media objects by IDs
     */
    async findByIds(
        mediaIds: string[],
        tenantId: string
    ): Promise<MediaObject[]> {
        if (mediaIds.length === 0) return [];

        const results = await db
            .select()
            .from(mediaObjects)
            .where(
                and(
                    inArray(mediaObjects.id, mediaIds),
                    eq(mediaObjects.tenantId, tenantId)
                )
            );

        return results;
    }
}

export const mediaRepository = new MediaRepository();
