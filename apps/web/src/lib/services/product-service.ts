import { db, dbWs } from "@vendly/db/db";
import { products, productMedia, mediaObjects } from "@vendly/db/schema";
import { eq, and, isNull, desc, sql, like } from "@vendly/db";
import { mediaService, type UploadFile } from "./media-service";
import type { CreateProductInput, ProductFilters, ProductWithMedia, UpdateProductInput } from "./product-models";

/**
 * Product Service for serverless environment
 */
export const productService = {
    /**
     * Create a new product with optional media
     */
    async createProduct(
        tenantId: string,
        tenantSlug: string,
        data: CreateProductInput,
        files: UploadFile[] = []
    ): Promise<ProductWithMedia> {
        const slug = data.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const createdProduct = await dbWs.transaction(async (tx) => {
            // Create product
            const [product] = await tx.insert(products).values({
                tenantId,
                storeId: data.storeId,
                productName: data.title,
                slug,
                description: data.description,
                priceAmount: data.priceAmount,
                currency: data.currency,
                source: data.source,
                sourceId: data.sourceId,
                sourceUrl: data.sourceUrl,
                isFeatured: data.isFeatured,
            }).returning();

            // Upload and attach media if files provided
            if (files.length > 0) {
                const uploadResult = await mediaService.uploadProductMedia(files, tenantSlug, product.id);

                const mediaObjectsData = await Promise.all(
                    uploadResult.images.map(async (img) => {
                        const [m] = await tx.insert(mediaObjects).values({
                            tenantId,
                            blobUrl: img.url,
                            blobPathname: img.pathname,
                            contentType: "image/jpeg",
                            source: "upload",
                        }).returning();
                        return m;
                    })
                );

                await Promise.all(
                    mediaObjectsData.map((m, index) =>
                        tx.insert(productMedia).values({
                            tenantId,
                            productId: product.id,
                            mediaId: m.id,
                            sortOrder: index,
                            isFeatured: index === 0,
                        })
                    )
                );
            }

            return product;
        });

        // Fetch user-facing product *after* transaction commits so 'db' (reader) can see it.
        return this.getProductWithMedia(createdProduct.id, tenantId);
    },

    /**
     * Upload files and attach to product
     */
    async uploadAndAttachMedia(
        tenantId: string,
        tenantSlug: string,
        productId: string,
        files: UploadFile[]
    ) {
        if (files.length === 0) return [];

        const uploadResult = await mediaService.uploadProductMedia(files, tenantSlug, productId);

        const mediaObjectsData = await Promise.all(
            uploadResult.images.map(async (img) => {
                const [media] = await db.insert(mediaObjects).values({
                    tenantId,
                    blobUrl: img.url,
                    blobPathname: img.pathname,
                    contentType: "image/jpeg",
                    source: "upload",
                }).returning();
                return media;
            })
        );

        await Promise.all(
            mediaObjectsData.map((media, index) =>
                db.insert(productMedia).values({
                    tenantId,
                    productId,
                    mediaId: media.id,
                    sortOrder: index,
                    isFeatured: index === 0,
                })
            )
        );

        return mediaObjectsData;
    },

    /**
     * Attach existing media URLs (e.g. from client-side upload)
     */
    async attachMediaUrls(
        tenantId: string,
        productId: string,
        media: Array<{ url: string; pathname: string; contentType?: string }>
    ) {
        if (media.length === 0) return [];

        const mediaObjectsData = await Promise.all(
            media.map(async (m) => {
                const [mediaObj] = await db.insert(mediaObjects).values({
                    tenantId,
                    blobUrl: m.url,
                    blobPathname: m.pathname,
                    contentType: m.contentType || "image/jpeg",
                    source: "upload",
                }).returning();
                return mediaObj;
            })
        );

        await Promise.all(
            mediaObjectsData.map((mediaObj, index) =>
                db.insert(productMedia).values({
                    tenantId,
                    productId,
                    mediaId: mediaObj.id,
                    sortOrder: index,
                    isFeatured: index === 0,
                })
            )
        );

        return mediaObjectsData;
    },

    /**
     * Get product with media
     */
    async getProductWithMedia(id: string, tenantId: string): Promise<ProductWithMedia> {
        const product = await db.query.products.findFirst({
            where: and(
                eq(products.id, id),
                eq(products.tenantId, tenantId),
                isNull(products.deletedAt)
            ),
            with: {
                media: {
                    with: { media: true },
                    orderBy: (m, { asc }) => [asc(m.sortOrder)],
                },
            },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        const formattedMedia = product.media.map((pm: any) => ({
            ...pm.media,
            sortOrder: pm.sortOrder,
            isFeatured: pm.isFeatured,
        }));

        return { ...product, media: formattedMedia } as ProductWithMedia;
    },

    /**
     * List products for a tenant
     */
    async listProducts(tenantId: string, filters: ProductFilters): Promise<{
        products: ProductWithMedia[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const { storeId, source, isFeatured, page, limit, search } = filters;
        const offset = (page - 1) * limit;

        const conditions = [
            eq(products.tenantId, tenantId),
            isNull(products.deletedAt),
        ];

        if (storeId) conditions.push(eq(products.storeId, storeId));
        if (source) conditions.push(eq(products.source, source));
        if (isFeatured !== undefined) conditions.push(eq(products.isFeatured, isFeatured));
        if (search) conditions.push(like(products.productName, `%${search}%`));

        const whereClause = and(...conditions);

        const productList = await db.query.products.findMany({
            where: whereClause,
            with: {
                media: {
                    with: { media: true },
                    orderBy: (m, { asc }) => [asc(m.sortOrder)],
                    limit: 1,
                },
            },
            orderBy: [desc(products.createdAt)],
            limit,
            offset,
        });

        const [{ count }] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(products)
            .where(whereClause);

        const productsWithMedia = productList.map((p: any) => ({
            ...p,
            media: p.media.map((pm: any) => ({
                ...pm.media,
                sortOrder: pm.sortOrder,
                isFeatured: pm.isFeatured,
            })),
        }));

        return {
            products: productsWithMedia as ProductWithMedia[],
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    },

    /**
     * Update a product
     */
    async updateProduct(id: string, tenantId: string, data: UpdateProductInput): Promise<ProductWithMedia> {
        const { media, ...productData } = data;

        const [updated] = await db.update(products)
            .set({
                ...productData,
                updatedAt: new Date(),
            })
            .where(and(
                eq(products.id, id),
                eq(products.tenantId, tenantId),
                isNull(products.deletedAt)
            ))
            .returning();

        if (!updated) {
            throw new Error("Product not found");
        }

        if (media) {
            // Sync media
            // 1. Delete existing product media links for this product
            // (We could be more smart and diff them, but full replace is easier and safer for ordering)
            // Note: We don't delete the actual MediaObjects here unless we are sure they are orphaned and we want to clean up.
            // For now, just unlink.
            await db.delete(productMedia).where(and(
                eq(productMedia.productId, id),
                eq(productMedia.tenantId, tenantId)
            ));

            // 2. Re-attach or create media objects
            await Promise.all(media.map(async (m, index) => {
                // Check if mediaObject already exists by blobUrl or pathname
                let mediaId: string;

                const existing = await db.query.mediaObjects.findFirst({
                    where: and(
                        eq(mediaObjects.tenantId, tenantId),
                        eq(mediaObjects.blobUrl, m.url)
                    )
                });

                if (existing) {
                    mediaId = existing.id;
                } else {
                    // Create new media object
                    const [newMedia] = await db.insert(mediaObjects).values({
                        tenantId,
                        blobUrl: m.url,
                        blobPathname: m.pathname,
                        contentType: m.contentType || "image/jpeg",
                        source: "upload",
                    }).returning();
                    mediaId = newMedia.id;
                }

                // Link to product
                await db.insert(productMedia).values({
                    tenantId,
                    productId: id,
                    mediaId,
                    sortOrder: index,
                    isFeatured: index === 0
                });
            }));
        }

        return this.getProductWithMedia(id, tenantId);
    },

    /**
     * Delete a product and its media
     */
    async deleteProduct(id: string, tenantId: string, tenantSlug: string): Promise<void> {
        const product = await this.getProductWithMedia(id, tenantId);

        // Soft delete the product
        await db.update(products)
            .set({ deletedAt: new Date() })
            .where(and(eq(products.id, id), eq(products.tenantId, tenantId)));

        // Delete uploaded media from blob storage
        const uploadedMedia = product.media.filter((m: any) => m.source === "upload");
        if (uploadedMedia.length > 0) {
            await mediaService.deleteBlobs(uploadedMedia.map((m: any) => m.blobUrl));
        }
    },

    /**
     * Helper: Generate a clean title from filename
     */
    generateTitleFromFilename(filename: string): string {
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
        const cleaned = nameWithoutExt.replace(/[_-]/g, " ");
        return cleaned
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    },
};
