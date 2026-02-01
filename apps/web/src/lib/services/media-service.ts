import { put, del, list } from "@vercel/blob";

export interface UploadFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
}

export interface UploadResult {
    url: string;
    pathname: string;
    originalName: string;
}

/**
 * Media Service for serverless environment
 * Handles Vercel Blob uploads and media management
 */
export const mediaService = {
    /**
     * Upload multiple product media files
     */
    async uploadProductMedia(
        files: UploadFile[],
        tenantSlug: string,
        productId: string
    ): Promise<{ count: number; images: UploadResult[] }> {
        if (files.length === 0) {
            return { count: 0, images: [] };
        }

        const uploadPromises = files.map(async (file) => {
            const timestamp = Date.now();
            const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
            const pathname = `${tenantSlug}/products/${productId}/${timestamp}-${sanitizedFilename}`;

            const blob = await put(pathname, file.buffer, {
                access: "public",
                contentType: file.mimetype,
            });

            return {
                url: blob.url,
                pathname: blob.pathname,
                originalName: file.originalname,
            };
        });

        const images = await Promise.all(uploadPromises);

        return {
            count: images.length,
            images,
        };
    },

    /**
     * Upload a single file
     */
    async uploadSingle(
        file: UploadFile,
        tenantSlug: string,
        folder: string = "images"
    ): Promise<{ url: string; pathname: string }> {
        const timestamp = Date.now();
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        const pathname = `${tenantSlug}/${folder}/${timestamp}-${sanitizedFilename}`;

        const blob = await put(pathname, file.buffer, {
            access: "public",
            contentType: file.mimetype,
        });

        return {
            url: blob.url,
            pathname: blob.pathname,
        };
    },

    /**
     * Delete multiple blobs by URL
     */
    async deleteBlobs(urls: string[]): Promise<void> {
        if (urls.length === 0) return;
        await Promise.all(urls.map((url) => del(url)));
    },

    /**
     * List blobs for a tenant
     */
    async listTenantBlobs(
        tenantSlug: string,
        options?: { limit?: number; cursor?: string }
    ) {
        const result = await list({
            prefix: `${tenantSlug}/`,
            limit: options?.limit || 100,
            cursor: options?.cursor,
        });

        return {
            blobs: result.blobs.map((blob) => ({
                url: blob.url,
                pathname: blob.pathname,
                size: blob.size,
                uploadedAt: blob.uploadedAt,
            })),
            hasMore: result.hasMore,
            cursor: result.cursor,
        };
    },
};
