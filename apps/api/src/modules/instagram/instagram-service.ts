/**
 * Instagram Service (Updated with Query Repository)
 * Handles business logic for Instagram integration
 */
import { uploadService } from "../storage/blob-service";
import { createInstagramQueries } from "../../../../../packages/db/src/queries/instagram-queries";
import type { DbClient } from "../db/db-client";
import {
    InstagramAPIResponse,
    InstagramMediaItem,
    SyncOptions,
    ImportMediaOptions,
    MediaSyncResult,
    ProductImportResult,
    generateProductTitle,
    sanitizeCaption,
} from "./instagram-model";

export class InstagramService {
    private readonly INSTAGRAM_API_VERSION = "v18.0";
    private readonly MEDIA_FIELDS =
        "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp";

    constructor(private db: DbClient) {}

    /**
     * Get queries instance
     */
    private getQueries() {
        return createInstagramQueries(this.db);
    }

    /**
     * Fetch media from Instagram Graph API
     */
    private async fetchInstagramMedia(
        accessToken: string
    ): Promise<InstagramMediaItem[]> {
        const url = `https://graph.instagram.com/${this.INSTAGRAM_API_VERSION}/me/media?fields=${this.MEDIA_FIELDS}&access_token=${accessToken}`;

        console.log("[InstagramService] Fetching media from Instagram API");

        const response = await fetch(url);
        const data: InstagramAPIResponse = await response.json();

        if ((data as any).error) {
            console.error("[InstagramService] Instagram API Error:", (data as any).error);
            throw new Error(
                `Failed to fetch media from Instagram: ${(data as any).error.message}`
            );
        }

        return data.data || [];
    }

    /**
     * Download media file from Instagram URL
     */
    private async downloadMediaFile(url: string): Promise<Buffer> {
        console.log("[InstagramService] Downloading media file");

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download media: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }

    /**
     * Upload Instagram media to Vercel Blob
     */
    private async uploadMediaToBlob(
        mediaUrl: string,
        tenantSlug: string,
        instagramId: string,
        mediaType: string
    ): Promise<string> {
        console.log(
            `[InstagramService] Uploading media ${instagramId} to Blob for ${tenantSlug}`
        );

        // Download the media file
        const fileBuffer = await this.downloadMediaFile(mediaUrl);

        // Determine file extension based on media type
        const extension = mediaType === "VIDEO" ? "mp4" : "jpg";
        const filename = `${instagramId}.${extension}`;

        // Upload to Blob using upload service
        const result = await uploadService.uploadSingle(
            {
                buffer: fileBuffer,
                originalname: filename,
                mimetype: mediaType === "VIDEO" ? "video/mp4" : "image/jpeg",
                size: fileBuffer.length,
            },
            {
                tenantSlug,
                processImage: mediaType !== "VIDEO", // Only process images
                size: "product",
            }
        );

        console.log(`[InstagramService] Media uploaded to Blob: ${result.url}`);
        return result.url;
    }

    /**
     * Sync Instagram media to database and Blob storage
     */
    async syncMedia(options: SyncOptions): Promise<MediaSyncResult> {
        console.log(`[InstagramService] Starting sync for ${options.tenantSlug}`);

        const queries = this.getQueries();
        let newItems = 0;
        let updatedItems = 0;
        const errors: string[] = [];

        try {
            // Get access token
            const accessToken = await queries.getInstagramAccessToken(options.userId);
            if (!accessToken) {
                throw new Error("Instagram account not connected");
            }

            // Get tenant and store
            const { tenant, store } = await queries.getTenantAndStore(options.tenantSlug);

            // Fetch media from Instagram
            const mediaItems = await this.fetchInstagramMedia(accessToken);
            console.log(`[InstagramService] Found ${mediaItems.length} media items`);

            // Process each media item
            for (const item of mediaItems) {
                try {
                    // Check if media already exists
                    const existingMedia = await queries.getMediaByInstagramId(item.id);

                    if (existingMedia) {
                        // Update existing media
                        await queries.updateMediaByInstagramId(item.id, {
                            caption: item.caption || null,
                            timestamp: new Date(item.timestamp),
                        });

                        updatedItems++;
                        continue;
                    }

                    // Upload media to Blob storage
                    const blobUrl = await this.uploadMediaToBlob(
                        item.media_url,
                        options.tenantSlug,
                        item.id,
                        item.media_type
                    );

                    // Upload thumbnail for videos
                    let thumbnailBlobUrl: string | null = null;
                    if (item.media_type === "VIDEO" && item.thumbnail_url) {
                        thumbnailBlobUrl = await this.uploadMediaToBlob(
                            item.thumbnail_url,
                            options.tenantSlug,
                            `${item.id}-thumb`,
                            "IMAGE"
                        );
                    }

                    // Insert new media with Blob URL
                    const newMedia = await queries.insertMedia({
                        storeId: store.id,
                        tenantId: tenant.id,
                        instagramId: item.id,
                        mediaType: item.media_type,
                        mediaUrl: blobUrl,
                        thumbnailUrl: thumbnailBlobUrl,
                        permalink: item.permalink,
                        caption: item.caption || null,
                        timestamp: new Date(item.timestamp),
                        isImported: false,
                    });

                    // Auto-import as draft product
                    const productTitle = generateProductTitle(item.caption, item.id);
                    const productDescription = sanitizeCaption(item.caption);

                    const newProduct = await queries.createProductFromMedia({
                        storeId: store.id,
                        tenantId: tenant.id,
                        title: productTitle,
                        description: productDescription,
                        priceAmount: 0,
                        status: "draft",
                    });

                    // Create product image from Blob URL
                    const imageUrl =
                        item.media_type === "VIDEO" && thumbnailBlobUrl
                            ? thumbnailBlobUrl
                            : blobUrl;

                    await queries.addProductImage({
                        productId: newProduct.id,
                        url: imageUrl,
                        sortOrder: 0,
                    });

                    // Link media to product
                    await queries.markAsImported(newMedia.id, newProduct.id);

                    newItems++;
                } catch (error) {
                    console.error(
                        `[InstagramService] Error processing media ${item.id}:`,
                        error
                    );
                    errors.push(
                        `Failed to process ${item.id}: ${error instanceof Error ? error.message : "Unknown error"}`
                    );
                }
            }

            return {
                success: true,
                count: mediaItems.length,
                newItems,
                updatedItems,
                errors: errors.length > 0 ? errors : undefined,
            };
        } catch (error) {
            console.error("[InstagramService] Sync failed:", error);
            throw error;
        }
    }

    /**
     * Get media list for tenant
     */
    async getMediaList(tenantSlug: string, showAll: boolean = false) {
        const queries = this.getQueries();
        const { store } = await queries.getTenantAndStore(tenantSlug);

        return await queries.listMediaByStore(store.id, {
            onlyNonImported: !showAll,
        });
    }

    /**
     * Import media as product
     */
    async importMediaAsProduct(
        options: ImportMediaOptions
    ): Promise<ProductImportResult> {
        console.log(
            `[InstagramService] Importing media ${options.mediaId} as product`
        );

        const queries = this.getQueries();

        try {
            const { tenant, store } = await queries.getTenantAndStore(
                options.tenantSlug
            );

            // Get the media item
            const media = await queries.getMediaByIdAndStore(
                options.mediaId,
                store.id
            );

            if (!media) {
                throw new Error("Media not found");
            }

            // Create product
            const productTitle =
                options.name || generateProductTitle(media.caption, media.instagramId);
            const productDescription = sanitizeCaption(media.caption);

            const newProduct = await queries.createProductFromMedia({
                storeId: store.id,
                tenantId: tenant.id,
                title: productTitle,
                description: productDescription,
                priceAmount: options.price ? Math.round(options.price * 100) : 0,
                status: "draft",
            });

            // Create product image from Blob URL
            const imageUrl =
                media.mediaType === "VIDEO" && media.thumbnailUrl
                    ? media.thumbnailUrl
                    : media.mediaUrl;

            await queries.addProductImage({
                productId: newProduct.id,
                url: imageUrl,
                sortOrder: 0,
            });

            // Mark media as imported
            await queries.markAsImported(options.mediaId, newProduct.id);

            return {
                success: true,
                product: {
                    id: newProduct.id,
                    title: newProduct.title,
                    status: newProduct.status,
                },
            };
        } catch (error) {
            console.error("[InstagramService] Import failed:", error);
            throw error;
        }
    }
}

/**
 * Create Instagram service instance
 */
export function createInstagramService(db: DbClient) {
    return new InstagramService(db);
}

// Singleton for TCP connection (Express API)
let instagramServiceInstance: InstagramService | null = null;

export function getInstagramService(db: DbClient) {
    if (!instagramServiceInstance) {
        instagramServiceInstance = new InstagramService(db);
    }
    return instagramServiceInstance;
}

// Export default instance
import { getDb } from "../db/db-client";
export const instagramService = new InstagramService(getDb());