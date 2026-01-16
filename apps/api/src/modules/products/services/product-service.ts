import {
    productRepository,
    ProductRepository,
} from "../repositories/product-repository";
import { mediaRepository, MediaRepository } from "../repositories/media-repository";
import { uploadService } from "../../storage/blob-service";
import {
    CreateProductInput,
    ProductFilters,
    UpdateProductInput,
    AttachMediaInput,
    ProductWithMedia,
    BulkUploadInput,
} from "../models/product-models";
import { UploadFile } from "../../storage/blob-model";
import { tenants } from "@vendly/db/schema";

export class ProductService {
    constructor(
        private productRepo: ProductRepository,
        private mediaRepo: MediaRepository
    ) { }

    /**
     * Create product with optional media
     */
    async createProduct(
        tenantId: string,
        tenantSlug: string,
        data: CreateProductInput,
        files: UploadFile[] = []
    ): Promise<ProductWithMedia> {
        // 1. Create product
        const product = await this.productRepo.create({
            tenantId,
            storeId: data.storeId,
            title: data.title,
            description: data.description,
            priceAmount: data.priceAmount,
            currency: data.currency,
            source: data.source,
            sourceId: data.sourceId,
            sourceUrl: data.sourceUrl,
            isFeatured: data.isFeatured,
        });

        // 2. Upload and link media if present
        if (files.length > 0) {
            const uploadResult = await uploadService.uploadProductMedia(
                files,
                tenantSlug,
                product.id
            );

            // Create media objects in DB
            const mediaObjects = await Promise.all(
                uploadResult.images.map((img) =>
                    this.mediaRepo.createMediaObject({
                        tenantId,
                        blobUrl: img.url,
                        blobPathname: img.pathname,
                        contentType: "image/jpeg", // We convert to jpeg
                        source: "upload",
                    })
                )
            );

            // Link to product
            await Promise.all(
                mediaObjects.map((media, index) =>
                    this.mediaRepo.createProductMedia({
                        tenantId,
                        productId: product.id,
                        mediaId: media.id,
                        sortOrder: index,
                        isFeatured: index === 0, // First image is featured
                    })
                )
            );
        }

        return this.getProductWithMedia(product.id, tenantId);
    }

    /**
     * Bulk upload (create multiple products from images)
     */
    async bulkCreateProducts(
        tenantId: string,
        tenantSlug: string,
        config: BulkUploadInput,
        files: UploadFile[]
    ): Promise<{ created: number; failures: number }> {
        let createdCount = 0;
        let failureCount = 0;

        // Process each file as a separate product
        // TODO: Optimize parallel processing with concurrency limit
        for (const file of files) {
            try {
                const title = config.generateTitles
                    ? file.originalname.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
                    : "Untitled Product";

                await this.createProduct(
                    tenantId,
                    tenantSlug,
                    {
                        storeId: config.storeId,
                        title,
                        priceAmount: config.defaultPrice,
                        currency: config.defaultCurrency,
                        source: "bulk-upload",
                        isFeatured: config.markAsFeatured,
                    },
                    [file]
                );
                createdCount++;
            } catch (error) {
                console.error(`Failed to create product from file ${file.originalname}:`, error);
                failureCount++;
            }
        }

        return { created: createdCount, failures: failureCount };
    }

    /**
     * Get single product with media
     */
    async getProductWithMedia(id: string, tenantId: string): Promise<ProductWithMedia> {
        const product = await this.productRepo.findById(id, tenantId);
        if (!product) {
            throw new Error("Product not found");
        }

        const media = await this.mediaRepo.getProductMedia(id);

        return {
            ...product,
            media,
        };
    }

    /**
     * List products with pagination
     */
    async listProducts(
        tenantId: string,
        filters: ProductFilters
    ): Promise<{ products: ProductWithMedia[]; total: number }> {
        const { products, total } = await this.productRepo.findByTenant(
            tenantId,
            filters
        );

        // Fetch media for each product
        // TODO: Optimize with a single join query in repository
        const productsWithMedia = await Promise.all(
            products.map(async (p) => {
                const media = await this.mediaRepo.getProductMedia(p.id);
                return { ...p, media };
            })
        );

        return { products: productsWithMedia, total };
    }

    /**
     * Update product details
     */
    async updateProduct(
        id: string,
        tenantId: string,
        data: UpdateProductInput
    ): Promise<ProductWithMedia> {
        const updated = await this.productRepo.update(id, tenantId, data);
        if (!updated) {
            throw new Error("Product not found");
        }
        return this.getProductWithMedia(id, tenantId);
    }

    /**
     * Delete product and cleanup media
     */
    async deleteProduct(id: string, tenantId: string, tenantSlug: string): Promise<void> {
        const product = await this.getProductWithMedia(id, tenantId);
        if (!product) return;

        // Delete from DB
        await this.productRepo.delete(id, tenantId);

        // Cleanup media
        // We only delete media blobs if they are exclusive to this product
        // For simplicity in MVP, we delete the product-media links
        // and let a background job handle blob cleanup if needed,
        // OR we can delete blobs immediately if source='upload'

        const mediaToDelete = product.media.filter(m => m.source === 'upload'); // Only delete uploaded files, not synced ones
        if (mediaToDelete.length > 0) {
            const urlsToDelete = mediaToDelete.map(m => m.blobUrl);
            try {
                // Delete from Vercel Blob
                await uploadService.deleteBlobs(urlsToDelete);

                // Delete media objects from DB
                await Promise.all(mediaToDelete.map(m =>
                    this.mediaRepo.deleteMediaObject(m.id, tenantId)
                ));
            } catch (error) {
                console.error("Failed to cleanup media files:", error);
                // Don't fail the request, just log
            }
        }
    }

    /**
     * Attach existing media to product
     */
    async attachMedia(
        productId: string,
        tenantId: string,
        data: AttachMediaInput
    ): Promise<void> {
        const product = await this.productRepo.findById(productId, tenantId);
        if (!product) throw new Error("Product not found");

        const mediaObjects = await this.mediaRepo.findByIds(data.mediaIds, tenantId);
        if (mediaObjects.length !== data.mediaIds.length) {
            throw new Error("One or more media items not found");
        }

        // Get current max sort order
        const currentMedia = await this.mediaRepo.getProductMedia(productId);
        let sortStart = currentMedia.length > 0
            ? Math.max(...currentMedia.map(m => m.sortOrder)) + 1
            : 0;

        await Promise.all(
            mediaObjects.map((media, index) =>
                this.mediaRepo.createProductMedia({
                    tenantId,
                    productId,
                    mediaId: media.id,
                    sortOrder: sortStart + index,
                    isFeatured: media.id === data.featuredMediaId,
                })
            )
        );
    }
}

export const productService = new ProductService(productRepository, mediaRepository);
