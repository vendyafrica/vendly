/**
 * Upload Service
 * Handles business logic for file uploads, processing, and storage
 */
import sharp from "sharp";
import { put, del, list } from "@vercel/blob";
import {
    UploadFile,
    UploadOptions,
    UploadResult,
    MultipleUploadResult,
    BlobListResult,
    ListOptions,
    IMAGE_SIZES,
    generatePathname,
    ImageDimensions,
} from "./blob-model";

export class UploadService {
    /**
     * Process image with Sharp
     * Resize and convert to JPEG
     */
    private async processImage(
        buffer: Buffer,
        dimensions: ImageDimensions
    ): Promise<Buffer> {
        try {
            return await sharp(buffer)
                .resize(dimensions.width, dimensions.height, {
                    fit: "cover",
                    position: "center",
                })
                .jpeg({ quality: 85 })
                .toBuffer();
        } catch (error) {
            console.error("[UploadService] Image processing failed:", error);
            throw new Error("Failed to process image");
        }
    }

    /**
     * Upload a single file
     */
    async uploadSingle(
        file: UploadFile,
        options: UploadOptions
    ): Promise<UploadResult> {
        console.log(`[UploadService] Uploading file for ${options.tenantSlug}`);

        try {
            let bufferToUpload = file.buffer;
            let contentType = file.mimetype;
            const dimensions = IMAGE_SIZES[options.size || "product"];
            let processedSize: number | undefined;

            // Process image if requested
            if (options.processImage !== false) {
                bufferToUpload = await this.processImage(file.buffer, dimensions);
                contentType = "image/jpeg";
                processedSize = bufferToUpload.length;
            }

            // Generate pathname
            const pathname = generatePathname(options, file.originalname);

            // Upload to Vercel Blob
            const result = await put(pathname, bufferToUpload, {
                access: "public",
                contentType,
                addRandomSuffix: false,
            });

            console.log(`[UploadService] Upload successful: ${result.url}`);

            return {
                url: result.url,
                pathname: result.pathname,
                contentType: result.contentType,
                size: options.processImage !== false ? dimensions : undefined,
                originalSize: file.size,
                processedSize,
            };
        } catch (error) {
            console.error("[UploadService] Upload failed:", error);
            throw new Error(
                error instanceof Error ? error.message : "Upload failed"
            );
        }
    }

    /**
     * Upload multiple files
     */
    async uploadMultiple(
        files: UploadFile[],
        options: UploadOptions
    ): Promise<MultipleUploadResult> {
        console.log(
            `[UploadService] Uploading ${files.length} files for ${options.tenantSlug}`
        );

        const results: MultipleUploadResult["images"] = [];
        const dimensions = IMAGE_SIZES[options.size || "product"];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                let bufferToUpload = file.buffer;

                // Process image if requested
                if (options.processImage !== false) {
                    bufferToUpload = await this.processImage(file.buffer, dimensions);
                }

                // Generate pathname with index
                const timestamp = Date.now();
                const sanitizedFilename = file.originalname.replace(
                    /[^a-zA-Z0-9.-]/g,
                    "_"
                );

                const pathname = options.productId
                    ? `${options.tenantSlug}/products/${options.productId}/${timestamp}-${i}-${sanitizedFilename}`
                    : `${options.tenantSlug}/images/${timestamp}-${i}-${sanitizedFilename}`;

                // Upload to Vercel Blob
                const result = await put(pathname, bufferToUpload, {
                    access: "public",
                    contentType: options.processImage !== false ? "image/jpeg" : file.mimetype,
                    addRandomSuffix: false,
                });

                results.push({
                    url: result.url,
                    pathname: result.pathname,
                    originalName: file.originalname,
                });
            }

            console.log(`[UploadService] Uploaded ${results.length} files`);

            return {
                count: results.length,
                images: results,
            };
        } catch (error) {
            console.error("[UploadService] Multiple upload failed:", error);
            throw new Error(
                error instanceof Error ? error.message : "Multiple upload failed"
            );
        }
    }

    /**
     * Delete a single blob by URL
     */
    async deleteBlob(url: string): Promise<void> {
        console.log(`[UploadService] Deleting blob: ${url}`);

        try {
            await del(url);
            console.log(`[UploadService] Delete successful`);
        } catch (error) {
            console.error("[UploadService] Delete failed:", error);
            throw new Error(
                error instanceof Error ? error.message : "Delete failed"
            );
        }
    }

    /**
     * Delete multiple blobs
     */
    async deleteBlobs(urls: string[]): Promise<void> {
        console.log(`[UploadService] Deleting ${urls.length} blobs`);

        try {
            await del(urls);
            console.log(`[UploadService] Bulk delete successful`);
        } catch (error) {
            console.error("[UploadService] Bulk delete failed:", error);
            throw new Error(
                error instanceof Error ? error.message : "Bulk delete failed"
            );
        }
    }

    /**
     * List blobs for a tenant
     */
    async listTenantBlobs(
        tenantSlug: string,
        options?: ListOptions
    ): Promise<BlobListResult> {
        console.log(`[UploadService] Listing blobs for tenant: ${tenantSlug}`);

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
            console.error("[UploadService] List failed:", error);
            throw new Error(
                error instanceof Error ? error.message : "List failed"
            );
        }
    }

    /**
     * List product images
     */
    async listProductImages(
        tenantSlug: string,
        productId: string,
        options?: ListOptions
    ): Promise<BlobListResult> {
        const prefix = `${tenantSlug}/products/${productId}/`;
        console.log(`[UploadService] Listing product images: ${prefix}`);

        try {
            const result = await list({
                prefix,
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
            console.error("[UploadService] List product images failed:", error);
            throw new Error(
                error instanceof Error ? error.message : "List failed"
            );
        }
    }
}

export const uploadService = new UploadService();