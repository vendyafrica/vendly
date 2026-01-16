/**
 * Upload Model
 * Defines the structure and validation for file uploads
 */

export interface UploadFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}

export interface UploadOptions {
    tenantSlug: string;
    productId?: string;
    size?: ImageSize;
    processImage?: boolean;
}

export type ImageSize = "thumbnail" | "small" | "medium" | "large" | "product";

export interface ImageDimensions {
    width: number;
    height: number;
}

export const IMAGE_SIZES: Record<ImageSize, ImageDimensions> = {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
    product: { width: 800, height: 800 },
};

export interface UploadResult {
    url: string;
    pathname: string;
    contentType: string;
    size?: ImageDimensions;
    originalSize?: number;
    processedSize?: number;
}

export interface MultipleUploadResult {
    count: number;
    images: Array<{
        url: string;
        pathname: string;
        originalName: string;
    }>;
}

export interface BlobInfo {
    url: string;
    pathname: string;
    size: number;
    uploadedAt: Date;
}

export interface BlobListResult {
    blobs: BlobInfo[];
    hasMore: boolean;
    cursor?: string;
}

export interface ListOptions {
    limit?: number;
    cursor?: string;
}

/**
 * Validate upload options
 */
export function validateUploadOptions(options: UploadOptions): string | null {
    if (!options.tenantSlug || options.tenantSlug.trim() === "") {
        return "tenantSlug is required";
    }

    if (options.size && !IMAGE_SIZES[options.size]) {
        return `Invalid size. Must be one of: ${Object.keys(IMAGE_SIZES).join(", ")}`;
    }

    return null;
}

/**
 * Validate file
 */
export function validateFile(file: UploadFile | undefined): string | null {
    if (!file) {
        return "No file provided";
    }

    if (!file.mimetype.startsWith("image/")) {
        return "Only image files are allowed";
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
    }

    return null;
}

/**
 * Generate pathname for upload
 */
export function generatePathname(options: UploadOptions, filename: string): string {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");

    if (options.productId) {
        return `${options.tenantSlug}/products/${options.productId}/${timestamp}-${sanitizedFilename}`;
    }

    return `${options.tenantSlug}/images/${timestamp}-${sanitizedFilename}`;
}