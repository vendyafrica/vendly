
import { uploadService } from "../storage/blob-service";
import { createInstagramQueries } from "../../../../../packages/db/src/queries/instagram-queries";
import { edgeDb } from "@vendly/db";
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

    constructor(private db: typeof edgeDb) { }

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
        const data = await response.json() as any;

        if (data.error) {
            console.error("[InstagramService] Instagram API Error:", data.error);
            throw new Error(
                `Failed to fetch media from Instagram: ${data.error.message}`
            );
        }

        return (data as InstagramAPIResponse).data || [];

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
    ): Promise<{ url: string; pathname: string; contentType: string; sizeBytes: number; width?: number; height?: number }> {
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

        const sizeBytes = result.processedSize ?? result.originalSize ?? fileBuffer.length;
        return {
            url: result.url,
            pathname: result.pathname,
            contentType: result.contentType,
            sizeBytes,
            width: result.size?.width,
            height: result.size?.height,
        };
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
                    const existingMedia = await queries.getMediaByInstagramId(tenant.id, item.id);

                    if (existingMedia) {
                        // Update existing media
                        await queries.updateMediaByInstagramId(tenant.id, item.id, {
                            caption: item.caption || null,
                            timestamp: new Date(item.timestamp),
                        });

                        updatedItems++;
                        continue;
                    }

                    // Upload media to Blob storage
                    const uploaded = await this.uploadMediaToBlob(
                        item.media_url,
                        options.tenantSlug,
                        item.id,
                        item.media_type
                    );

                    const mediaObject = await queries.createMediaObject({
                        tenantId: tenant.id,
                        blobUrl: uploaded.url,
                        blobPathname: uploaded.pathname,
                        contentType: uploaded.contentType,
                        sizeBytes: uploaded.sizeBytes,
                        width: uploaded.width,
                        height: uploaded.height,
                        isPublic: true,
                        source: "instagram",
                    });

                    // Upload thumbnail for videos
                    let thumbnailBlobUrl: string | null = null;
                    let thumbnailMediaObjectId: string | null = null;
                    if (item.media_type === "VIDEO" && item.thumbnail_url) {
                        const uploadedThumb = await this.uploadMediaToBlob(
                            item.thumbnail_url,
                            options.tenantSlug,
                            `${item.id}-thumb`,
                            "IMAGE"
                        );

                        thumbnailBlobUrl = uploadedThumb.url;

                        const thumbMediaObject = await queries.createMediaObject({
                            tenantId: tenant.id,
                            blobUrl: uploadedThumb.url,
                            blobPathname: uploadedThumb.pathname,
                            contentType: uploadedThumb.contentType,
                            sizeBytes: uploadedThumb.sizeBytes,
                            width: uploadedThumb.width,
                            height: uploadedThumb.height,
                            isPublic: true,
                            source: "instagram",
                        });

                        thumbnailMediaObjectId = thumbMediaObject.id;
                    }

                    // Insert new media with Blob URL
                    const newMedia = await queries.insertMedia({
                        storeId: store.id,
                        tenantId: tenant.id,
                        instagramId: item.id,
                        mediaType: item.media_type,
                        mediaUrl: uploaded.url,
                        thumbnailUrl: thumbnailBlobUrl,
                        mediaObjectId: mediaObject.id,
                        thumbnailMediaObjectId,
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
                            : uploaded.url;

                    await queries.addProductImage({
                        productId: newProduct.id,
                        url: imageUrl,
                        sortOrder: 0,
                    });

                    const featuredMediaObjectId =
                        item.media_type === "VIDEO" && thumbnailMediaObjectId
                            ? thumbnailMediaObjectId
                            : mediaObject.id;

                    await queries.linkMediaToProduct({
                        tenantId: tenant.id,
                        productId: newProduct.id,
                        mediaId: featuredMediaObjectId,
                        sortOrder: 0,
                        isFeatured: true,
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
                options.name || generateProductTitle(media.caption || undefined, media.instagramId);
            const productDescription = sanitizeCaption(media.caption || undefined);

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

            const featuredMediaObjectId =
                media.mediaType === "VIDEO" && media.thumbnailMediaObjectId
                    ? media.thumbnailMediaObjectId
                    : media.mediaObjectId;

            if (featuredMediaObjectId) {
                await queries.linkMediaToProduct({
                    tenantId: tenant.id,
                    productId: newProduct.id,
                    mediaId: featuredMediaObjectId,
                    sortOrder: 0,
                    isFeatured: true,
                });
            } else {
                const legacyMediaObject = await queries.createMediaObject({
                    tenantId: tenant.id,
                    blobUrl: imageUrl,
                    isPublic: true,
                    source: "instagram",
                });

                await queries.linkMediaToProduct({
                    tenantId: tenant.id,
                    productId: newProduct.id,
                    mediaId: legacyMediaObject.id,
                    sortOrder: 0,
                    isFeatured: true,
                });
            }

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

    /**
     * Subscribe app to Instagram webhooks
     */
    async subscribeApp(userId: string, fields: string[] = ["comments", "mentions", "messages"]): Promise<boolean> {
        console.log(`[InstagramService] Subscribing app to webhooks for user ${userId}`);
        const queries = this.getQueries();

        try {
            const accessToken = await queries.getInstagramAccessToken(userId);
            if (!accessToken) {
                throw new Error("Instagram account not connected");
            }

            const url = `https://graph.instagram.com/${this.INSTAGRAM_API_VERSION}/me/subscribed_apps?subscribed_fields=${fields.join(",")}&access_token=${accessToken}`;

            const response = await fetch(url, { method: "POST" });
            const data = await response.json() as any;

            if (data.success) {
                console.log("[InstagramService] Successfully subscribed to webhooks");
                return true;
            } else {
                console.error("[InstagramService] Failed to subscribe:", data);
                // Don't throw here, just return false so the flow can continue (we still want to sync)
                return false;
            }
        } catch (error) {
            console.error("[InstagramService] Subscription error:", error);
            // Don't throw here either
            return false;
        }
    }

    /**
     * Initialize integration (Subscribe + First Sync)
     */
    async initializeIntegration(tenantSlug: string, userId: string): Promise<{ subscribed: boolean; syncResult: MediaSyncResult }> {
        console.log(`[InstagramService] Initializing integration for ${tenantSlug}`);

        // 1. Subscribe to webhooks
        const subscribed = await this.subscribeApp(userId);

        // 2. Perform initial sync
        const syncResult = await this.syncMedia({
            tenantSlug,
            userId,
            forceRefresh: true
        });

        return {
            subscribed,
            syncResult
        };
    }
}

/**
 * Create Instagram service instance
 */
export function createInstagramService(db: typeof edgeDb) {
    return new InstagramService(db);
}

// Singleton for TCP connection (Express API)
let instagramServiceInstance: InstagramService | null = null;

export function getInstagramService(db: typeof edgeDb) {
    if (!instagramServiceInstance) {
        instagramServiceInstance = new InstagramService(db);
    }
    return instagramServiceInstance;
}

// Export default instance
export const instagramService = new InstagramService(edgeDb);