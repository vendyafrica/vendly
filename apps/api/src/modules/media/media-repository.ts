import { db } from "@vendly/db/db";
import {
    mediaObjects,
    productMedia,
    type MediaObject,
    type NewMediaObject,
    type NewProductMedia,
} from "@vendly/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export class MediaRepository {
    async createMediaObject(
        data: NewMediaObject
    ): Promise<MediaObject> {
        const [created] = await db
            .insert(mediaObjects)
            .values(data)
            .returning();

        return created;
    }

    async createProductMedia(
        data: NewProductMedia
    ): Promise<void> {
        await db.insert(productMedia).values(data);
    }

    async getMediaForProduct(
        productId: string,
        tenantId: string
    ): Promise<
        Array<MediaObject & { sortOrder: number; isFeatured: boolean }>
    > {
        return db
            .select({
                id: mediaObjects.id,
                createdAt: mediaObjects.createdAt,
                updatedAt: mediaObjects.updatedAt,
                tenantId: mediaObjects.tenantId,
                source: mediaObjects.source,
                blobUrl: mediaObjects.blobUrl,
                blobPathname: mediaObjects.blobPathname,
                contentType: mediaObjects.contentType,
                sourceMediaId: mediaObjects.sourceMediaId,
                sourceMetadata: mediaObjects.sourceMetadata,
                isPublic: mediaObjects.isPublic,
                lastSyncedAt: mediaObjects.lastSyncedAt,
                sortOrder: productMedia.sortOrder,
                isFeatured: productMedia.isFeatured,
            })
            .from(productMedia)
            .innerJoin(
                mediaObjects,
                eq(productMedia.mediaId, mediaObjects.id)
            )
            .where(
                and(
                    eq(productMedia.productId, productId),
                    eq(mediaObjects.tenantId, tenantId)
                )
            );
    }

    async deleteMediaObject(
        mediaId: string,
        tenantId: string
    ): Promise<void> {
        await db
            .delete(mediaObjects)
            .where(
                and(
                    eq(mediaObjects.id, mediaId),
                    eq(mediaObjects.tenantId, tenantId)
                )
            );
    }

    async findByIds(
        ids: string[],
        tenantId: string
    ): Promise<MediaObject[]> {
        if (ids.length === 0) return [];

        return db
            .select()
            .from(mediaObjects)
            .where(
                and(
                    inArray(mediaObjects.id, ids),
                    eq(mediaObjects.tenantId, tenantId)
                )
            );
    }
}

export const mediaRepository = new MediaRepository();
