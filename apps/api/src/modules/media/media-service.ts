import { MediaRepository } from "./media-repository";
import { uploadService } from "../../lib/blob-service";
import { UploadFile } from "./media-model";
import type { MediaObject } from "@vendly/db/schema";

export class MediaService {
    constructor(private mediaRepo: MediaRepository) { }

    async uploadAndAttachToProduct(
        tenantId: string,
        tenantSlug: string,
        productId: string,
        files: UploadFile[]
    ) {
        if (files.length === 0) return [];

        const uploadResult = await uploadService.uploadProductMedia(
            files,
            tenantSlug,
            productId
        );

        const mediaObjects = await Promise.all(
            uploadResult.images.map(img =>
                this.mediaRepo.createMediaObject({
                    tenantId,
                    blobUrl: img.url,
                    blobPathname: img.pathname,
                    contentType: "image/jpeg",
                    source: "upload",
                })
            )
        );

        await Promise.all(
            mediaObjects.map((media, index) =>
                this.mediaRepo.createProductMedia({
                    tenantId,
                    productId,
                    mediaId: media.id,
                    sortOrder: index,
                    isFeatured: index === 0,
                })
            )
        );

        return mediaObjects;
    }

    /**
     * Create product media from external URL (Instagram, etc.)
     * Downloads from URL, uploads to blob storage, and links to product
     */
    async createProductMediaFromUrl(
        tenantId: string,
        tenantSlug: string,
        productId: string,
        mediaUrl: string,
        metadata: {
            source: string;
            sourceMediaId: string;
            sourceMetadata: any;
        }
    ): Promise<MediaObject> {
        // 1. Generate pathname for the media
        const pathname = `${tenantSlug}/${metadata.source}/${metadata.sourceMediaId}.jpg`;

        // 2. Download from URL and upload to blob storage
        const uploadResult = await uploadService.uploadFromUrl(
            mediaUrl,
            tenantSlug,
            pathname
        );

        // 3. Create media object with source metadata
        const mediaObject = await this.mediaRepo.createMediaObject({
            tenantId,
            blobUrl: uploadResult.url,
            blobPathname: uploadResult.pathname,
            contentType: "image/jpeg",
            source: metadata.source,
            sourceMediaId: metadata.sourceMediaId,
            sourceMetadata: metadata.sourceMetadata,
            lastSyncedAt: new Date(),
        });

        // 4. Link to product
        await this.mediaRepo.createProductMedia({
            tenantId,
            productId,
            mediaId: mediaObject.id,
            sortOrder: 0,
            isFeatured: true,
        });

        return mediaObject;
    }

    async getMediaForProduct(
        productId: string,
        tenantId: string
    ) {
        return this.mediaRepo.getMediaForProduct(productId, tenantId);
    }

    async deleteUploadedMedia(
        tenantId: string,
        media: Array<{ id: string; blobUrl: string; source: string }>
    ) {
        const uploaded = media.filter(m => m.source === "upload");
        if (uploaded.length === 0) return;

        await uploadService.deleteBlobs(uploaded.map(m => m.blobUrl));

        await Promise.all(
            uploaded.map(m =>
                this.mediaRepo.deleteMediaObject(m.id, tenantId)
            )
        );
    }
}
