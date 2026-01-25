import { MediaRepository } from "./media-repository";
import { uploadService } from "./blob-service";
import { UploadFile } from "./media-model";

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
