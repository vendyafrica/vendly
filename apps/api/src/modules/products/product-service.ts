// services/product-service.ts
import { ProductRepository } from "./product-repository";
import { MediaService } from "../media/media-service";
import {
    CreateProductInput,
    ProductWithMedia,
    BulkUploadInput,
    ProductFilters,
} from "./product-models";
import { UploadFile } from "../media/media-model";

export class ProductService {
    constructor(
        private productRepo: ProductRepository,
        private mediaService: MediaService
    ) { }

    async createProduct(
        tenantId: string,
        tenantSlug: string,
        data: CreateProductInput,
        files: UploadFile[] = []
    ): Promise<ProductWithMedia> {

        const product = await this.productRepo.create({
            tenantId,
            storeId: data.storeId,
            productName: data.title,
            priceAmount: data.priceAmount,
            currency: data.currency,
            source: data.source,
            sourceId: data.sourceId,
            sourceUrl: data.sourceUrl,
            isFeatured: data.isFeatured,
        });

        await this.mediaService.uploadAndAttachToProduct(
            tenantId,
            tenantSlug,
            product.id,
            files
        );

        return this.getProductWithMedia(product.id, tenantId);
    }

    async bulkCreateProducts(
        tenantId: string,
        tenantSlug: string,
        config: BulkUploadInput,
        files: UploadFile[]
    ): Promise<{ created: number; products: ProductWithMedia[] }> {
        if (files.length === 0) {
            return { created: 0, products: [] };
        }

        // Create products for each file
        const productPromises = files.map(async (file, index) => {
            const productName = config.generateTitles
                ? this.generateTitleFromFilename(file.originalname)
                : `Product ${index + 1}`;

            const product = await this.productRepo.create({
                tenantId,
                storeId: config.storeId,
                productName: productName,
                priceAmount: config.defaultPrice,
                currency: config.defaultCurrency,
                source: "bulk-upload",
                isFeatured: config.markAsFeatured,
            });

            // Upload and attach the single file to this product
            await this.mediaService.uploadAndAttachToProduct(
                tenantId,
                tenantSlug,
                product.id,
                [file]
            );

            return product;
        });

        const products = await Promise.all(productPromises);

        // Fetch all products with media
        const productsWithMedia = await Promise.all(
            products.map(p => this.getProductWithMedia(p.id, tenantId))
        );

        return {
            created: products.length,
            products: productsWithMedia,
        };
    }

    async listProducts(
        tenantId: string,
        filters: ProductFilters
    ): Promise<{
        products: ProductWithMedia[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const result = await this.productRepo.findByTenant(tenantId, filters);

        // Fetch media for each product
        const productsWithMedia = await Promise.all(
            result.products.map(async (product) => {
                const media = await this.mediaService.getMediaForProduct(
                    product.id,
                    tenantId
                );
                return { ...product, media };
            })
        );

        return {
            products: productsWithMedia,
            total: result.total,
            page: filters.page,
            limit: filters.limit,
            totalPages: Math.ceil(result.total / filters.limit),
        };
    }

    async getProductWithMedia(
        id: string,
        tenantId: string
    ): Promise<ProductWithMedia> {
        const product = await this.productRepo.findById(id, tenantId);
        if (!product) throw new Error("Product not found");

        const media = await this.mediaService.getMediaForProduct(
            id,
            tenantId
        );
        return { ...product, media };
    }

    /**
     * Update a product
     */
    async updateProduct(
        id: string,
        tenantId: string,
        data: Partial<{
            productName: string;
            description: string;
            priceAmount: number;
            currency: string;
            quantity: number;
            status: string;
            isFeatured: boolean;
        }>
    ): Promise<ProductWithMedia> {
        const updated = await this.productRepo.update(id, tenantId, data);
        if (!updated) {
            throw new Error("Product not found");
        }
        return this.getProductWithMedia(id, tenantId);
    }

    async deleteProduct(
        id: string,
        tenantId: string,
        tenantSlug: string
    ): Promise<void> {
        const product = await this.getProductWithMedia(id, tenantId);

        await this.productRepo.delete(id, tenantId);

        await this.mediaService.deleteUploadedMedia(
            tenantId,
            product.media
        );
    }

    /**
     * Helper: Generate a clean title from filename
     */
    private generateTitleFromFilename(filename: string): string {
        // Remove extension
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");

        // Replace underscores and hyphens with spaces
        const cleaned = nameWithoutExt.replace(/[_-]/g, " ");

        // Capitalize first letter of each word
        return cleaned
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    }
}
