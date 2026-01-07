/**
 * Blob Storage Service
 * Uses Vercel Blob for storing static assets (images, media)
 */
import { put, del, list, type PutBlobResult } from "@vercel/blob";

export interface UploadResult {
    url: string;
    pathname: string;
    contentType: string;
    contentDisposition: string;
}

export interface BlobListResult {
    blobs: Array<{
        url: string;
        pathname: string;
        size: number;
        uploadedAt: Date;
    }>;
    hasMore: boolean;
    cursor?: string;
}

export class BlobStorageService {
    /**
     * Upload an image to Vercel Blob storage
     * @param file - The file buffer or Blob to upload
     * @param filename - Original filename (will be prefixed with tenant path)
     * @param tenantSlug - The tenant's unique identifier for path organization
     * @param contentType - MIME type of the file (e.g., 'image/jpeg')
     */
    async uploadImage(
        file: Buffer | Blob,
        filename: string,
        tenantSlug: string,
        contentType?: string
    ): Promise<UploadResult> {
        console.log(`[BlobStorage] Uploading ${filename} for tenant: ${tenantSlug}`);

        const pathname = `${tenantSlug}/${Date.now()}-${filename}`;

        try {
            const result: PutBlobResult = await put(pathname, file, {
                access: "public",
                contentType,
                addRandomSuffix: false, // We already add timestamp
            });

            console.log(`[BlobStorage] Upload successful: ${result.url}`);

            return {
                url: result.url,
                pathname: result.pathname,
                contentType: result.contentType,
                contentDisposition: result.contentDisposition,
            };
        } catch (error) {
            console.error(`[BlobStorage] Upload failed:`, error);
            throw error;
        }
    }

    /**
     * Upload a product image
     */
    async uploadProductImage(
        file: Buffer | Blob,
        filename: string,
        tenantSlug: string,
        productId: string,
        contentType?: string
    ): Promise<UploadResult> {
        const pathname = `${tenantSlug}/products/${productId}/${Date.now()}-${filename}`;

        console.log(`[BlobStorage] Uploading product image: ${pathname}`);

        try {
            const result = await put(pathname, file, {
                access: "public",
                contentType,
                addRandomSuffix: false,
            });

            return {
                url: result.url,
                pathname: result.pathname,
                contentType: result.contentType,
                contentDisposition: result.contentDisposition,
            };
        } catch (error) {
            console.error(`[BlobStorage] Product image upload failed:`, error);
            throw error;
        }
    }

    /**
     * Delete a blob by URL
     */
    async deleteBlob(url: string): Promise<void> {
        console.log(`[BlobStorage] Deleting blob: ${url}`);

        try {
            await del(url);
            console.log(`[BlobStorage] Delete successful`);
        } catch (error) {
            console.error(`[BlobStorage] Delete failed:`, error);
            throw error;
        }
    }

    /**
     * Delete multiple blobs
     */
    async deleteBlobs(urls: string[]): Promise<void> {
        console.log(`[BlobStorage] Deleting ${urls.length} blobs`);

        try {
            await del(urls);
            console.log(`[BlobStorage] Bulk delete successful`);
        } catch (error) {
            console.error(`[BlobStorage] Bulk delete failed:`, error);
            throw error;
        }
    }

    /**
     * List all blobs for a tenant
     */
    async listTenantBlobs(
        tenantSlug: string,
        options?: { limit?: number; cursor?: string }
    ): Promise<BlobListResult> {
        console.log(`[BlobStorage] Listing blobs for tenant: ${tenantSlug}`);

        try {
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
        } catch (error) {
            console.error(`[BlobStorage] List failed:`, error);
            throw error;
        }
    }

    /**
     * List product images for a specific product
     */
    async listProductImages(
        tenantSlug: string,
        productId: string
    ): Promise<BlobListResult> {
        const prefix = `${tenantSlug}/products/${productId}/`;
        console.log(`[BlobStorage] Listing product images: ${prefix}`);

        try {
            const result = await list({ prefix });

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
        } catch (error) {
            console.error(`[BlobStorage] List product images failed:`, error);
            throw error;
        }
    }
}

export const blobStorageService = new BlobStorageService();
