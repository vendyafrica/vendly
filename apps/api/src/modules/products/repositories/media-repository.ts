import { db } from "@vendly/db/db";
import { mediaObjects, productMedia, type MediaObject, type NewMediaObject } from "@vendly/db/schema";
import { eq } from "drizzle-orm";

export const mediaRepository = {
    async createMediaObject(data: NewMediaObject): Promise<MediaObject> {
        const [media] = await db.insert(mediaObjects).values(data).returning();
        return media;
    },

    async linkMediaToProduct(tenantId: string, productId: string, mediaId: string, sortOrder = 0, isFeatured = false): Promise<void> {
        await db.insert(productMedia).values({
            tenantId,
            productId,
            mediaId,
            sortOrder,
            isFeatured
        }).onConflictDoNothing();
    }
};

export type MediaRepository = typeof mediaRepository;
