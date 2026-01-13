import { productRepository, type ProductRepository } from "../repositories/product.repository";
import { mediaRepository, type MediaRepository } from "../repositories/media.repository";

export class ProductService {
    constructor(
        private productRepo: ProductRepository = productRepository,
        private mediaRepo: MediaRepository = mediaRepository
    ) { }

    async getProducts(storeId: string) {
        return this.productRepo.findByStoreId(storeId);
    }

    async getProduct(id: string) {
        return this.productRepo.findById(id);
    }

    async createProduct(input: {
        tenantId: string;
        storeId: string;
        title: string;
        description?: string;
        priceAmount: number;
        currency: string;
        images?: string[]; // Array of blob URLs
    }) {
        const product = await this.productRepo.create({
            tenantId: input.tenantId,
            storeId: input.storeId,
            title: input.title,
            slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            description: input.description,
            priceAmount: input.priceAmount, // Schema uses numeric/decimal usually
            currency: input.currency,
            status: "active",
            source: "manual"
        });

        // Handle images if provided
        if (input.images && input.images.length > 0) {
            await Promise.all(input.images.map(async (url, index) => {
                // Create media object (simplified, normally we'd have size/type)
                const media = await this.mediaRepo.createMediaObject({
                    tenantId: input.tenantId,
                    blobUrl: url,
                    blobPathname: new URL(url).pathname,
                    source: "manual",
                    contentType: "image/jpeg", // Defaulting for now
                    sizeBytes: 0
                });

                // Link to product
                await this.mediaRepo.linkMediaToProduct(input.tenantId, product.id, media.id, index, index === 0);
            }));
        }

        return product;
    }

    async deleteProduct(id: string) {
        return this.productRepo.delete(id);
    }
}

export const productService = new ProductService();
