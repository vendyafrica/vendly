/**
 * Instagram Model
 * Defines data structures and validation for Instagram integration
 */

export interface InstagramMediaItem {
    id: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    media_url: string;
    thumbnail_url?: string;
    permalink: string;
    caption?: string;
    timestamp: string;
}

export interface InstagramAPIResponse {
    data: InstagramMediaItem[];
    paging?: {
        cursors?: {
            before?: string;
            after?: string;
        };
        next?: string;
    };
}

export interface SyncOptions {
    tenantSlug: string;
    userId: string;
    forceRefresh?: boolean;
}

export interface ImportMediaOptions {
    tenantSlug: string;
    userId: string;
    mediaId: string;
    price?: number;
    name?: string;
}

export interface WebhookVerificationParams {
    mode: string;
    token: string;
    challenge: string;
}

export interface InstagramWebhookEntry {
    id: string;
    time: number;
    changes?: any[];
    messaging?: InstagramMessagingEvent[];
}

export interface InstagramMessagingEvent {
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
    message?: InstagramMessage;
}

export interface InstagramMessage {
    mid: string;
    text?: string;
    attachments?: InstagramAttachment[];
    is_echo?: boolean;
}

export interface InstagramAttachment {
    type: "image" | "video" | "audio" | "file" | "share" | "story_mention" | "ig_post";
    payload: InstagramSharePayload | any;
}

export interface InstagramSharePayload {
    url: string;
    ig_post_media_id?: string; // specific to ig_post
    title?: string;
}

export interface InstagramWebhookPayload {
    object: string;
    entry?: InstagramWebhookEntry[];
}

export interface MediaSyncResult {
    success: boolean;
    count: number;
    newItems: number;
    updatedItems: number;
    errors?: string[];
}

export interface ProductImportResult {
    success: boolean;
    product: {
        id: string;
        title: string;
        status: string;
    };
}

/**
 * Validate sync options
 */
export function validateSyncOptions(options: SyncOptions): string | null {
    if (!options.tenantSlug || options.tenantSlug.trim() === "") {
        return "tenantSlug is required";
    }

    if (!options.userId || options.userId.trim() === "") {
        return "userId is required";
    }

    return null;
}

/**
 * Validate import options
 */
export function validateImportOptions(options: ImportMediaOptions): string | null {
    if (!options.tenantSlug || options.tenantSlug.trim() === "") {
        return "tenantSlug is required";
    }

    if (!options.mediaId || options.mediaId.trim() === "") {
        return "mediaId is required";
    }

    if (options.price !== undefined && (isNaN(options.price) || options.price < 0)) {
        return "price must be a positive number";
    }

    return null;
}

/**
 * Validate webhook verification params
 */
export function validateWebhookVerification(
    params: Partial<WebhookVerificationParams>
): string | null {
    if (!params.mode || !params.token || !params.challenge) {
        return "Missing required webhook verification parameters";
    }

    return null;
}

/**
 * Convert Instagram media type to product-friendly type
 */
export function getMediaTypeForProduct(mediaType: string): "image" | "video" {
    return mediaType === "VIDEO" ? "video" : "image";
}

/**
 * Generate product title from caption
 */
export function generateProductTitle(caption?: string, instagramId?: string): string {
    if (caption && caption.trim().length > 0) {
        // Take first line or first 100 characters
        const firstLine = caption.split("\n")[0];
        return firstLine.slice(0, 100).trim();
    }
    return instagramId ? `Instagram Post ${instagramId}` : "Instagram Post";
}

/**
 * Sanitize caption for product description
 */
export function sanitizeCaption(caption?: string): string | null {
    if (!caption || caption.trim().length === 0) return null;

    // Remove excessive hashtags and clean up
    return caption
        .replace(/#[\w]+/g, "") // Remove hashtags
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();
}