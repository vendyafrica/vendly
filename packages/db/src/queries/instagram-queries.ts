// import { eq, and, desc } from "drizzle-orm";
// import {
//     instagramMedia,
//     stores,
//     tenants,
//     account,
//     products,
//     mediaObjects,
//     productMedia,
// } from "../schema/index";
// import { edgeDb } from "../db";

// /**
//  * Instagram Queries
//  */
// export class InstagramQueries {
//     constructor(private db: typeof edgeDb) { }

//     /**
//      * Get Instagram account for user
//      */
//     async getInstagramAccount(userId: string) {
//         const [igAccount] = await this.db
//             .select()
//             .from(account)
//             .where(and(eq(account.userId, userId), eq(account.providerId, "instagram")))
//             .limit(1);

//         return igAccount || null;
//     }

//     /**
//      * Get Instagram access token for user
//      */
//     async getInstagramAccessToken(userId: string): Promise<string | null> {
//         const igAccount = await this.getInstagramAccount(userId);
//         return igAccount?.accessToken || null;
//     }

//     /**
//      * Get tenant by slug
//      */
//     async getTenantBySlug(tenantSlug: string) {
//         const [tenant] = await this.db
//             .select()
//             .from(tenants)
//             .where(eq(tenants.slug, tenantSlug))
//             .limit(1);

//         return tenant || null;
//     }

//     /**
//      * Get store by tenant ID
//      */
//     async getStoreByTenantId(tenantId: string) {
//         const [store] = await this.db
//             .select()
//             .from(stores)
//             .where(eq(stores.tenantId, tenantId))
//             .limit(1);

//         return store || null;
//     }

//     /**
//      * Get tenant and store by slug
//      */
//     async getTenantAndStore(tenantSlug: string) {
//         const tenant = await this.getTenantBySlug(tenantSlug);
//         if (!tenant) {
//             throw new Error("Tenant not found");
//         }

//         const store = await this.getStoreByTenantId(tenant.id);
//         if (!store) {
//             throw new Error("Store not found");
//         }

//         return { tenant, store };
//     }

//     /**
//      * Check if Instagram media exists by Instagram ID
//      */
//     async getMediaByInstagramId(tenantId: string, instagramId: string) {
//         const [media] = await this.db
//             .select()
//             .from(instagramMedia)
//             .where(and(eq(instagramMedia.tenantId, tenantId), eq(instagramMedia.instagramId, instagramId)))
//             .limit(1);

//         return media || null;
//     }

//     /**
//      * Get Instagram media by ID
//      */
//     async getMediaById(mediaId: string) {
//         const [media] = await this.db
//             .select()
//             .from(instagramMedia)
//             .where(eq(instagramMedia.id, mediaId))
//             .limit(1);

//         return media || null;
//     }

//     /**
//      * Get media by ID and store
//      */
//     async getMediaByIdAndStore(mediaId: string, storeId: string) {
//         const [media] = await this.db
//             .select()
//             .from(instagramMedia)
//             .where(
//                 and(
//                     eq(instagramMedia.id, mediaId),
//                     eq(instagramMedia.storeId, storeId)
//                 )
//             )
//             .limit(1);

//         return media || null;
//     }

//     /**
//      * List media for store
//      */
//     async listMediaByStore(storeId: string, options?: { onlyNonImported?: boolean }) {
//         const conditions = [eq(instagramMedia.storeId, storeId)];

//         if (options?.onlyNonImported) {
//             conditions.push(eq(instagramMedia.isImported, false));
//         }

//         return await this.db
//             .select()
//             .from(instagramMedia)
//             .where(and(...conditions))
//             .orderBy(desc(instagramMedia.timestamp));
//     }

//     /**
//      * Insert new Instagram media
//      */
//     async insertMedia(data: {
//         storeId: string;
//         tenantId: string;
//         instagramId: string;
//         mediaType: string;
//         mediaUrl: string;
//         thumbnailUrl?: string | null;
//         mediaObjectId?: string | null;
//         thumbnailMediaObjectId?: string | null;
//         permalink: string;
//         caption?: string | null;
//         timestamp: Date;
//         isImported?: boolean;
//     }) {
//         const [newMedia] = await this.db
//             .insert(instagramMedia)
//             .values({
//                 storeId: data.storeId,
//                 tenantId: data.tenantId,
//                 instagramId: data.instagramId,
//                 mediaType: data.mediaType,
//                 mediaUrl: data.mediaUrl,
//                 thumbnailUrl: data.thumbnailUrl || null,
//                 mediaObjectId: data.mediaObjectId || null,
//                 thumbnailMediaObjectId: data.thumbnailMediaObjectId || null,
//                 permalink: data.permalink,
//                 caption: data.caption || null,
//                 timestamp: data.timestamp,
//                 isImported: data.isImported ?? false,
//             })
//             .returning();

//         return newMedia;
//     }

//     /**
//      * Update Instagram media
//      */
//     async updateMedia(
//         mediaId: string,
//         data: {
//             caption?: string | null;
//             timestamp?: Date;
//             isImported?: boolean;
//             productId?: string | null;
//         }
//     ) {
//         const [updated] = await this.db
//             .update(instagramMedia)
//             .set(data)
//             .where(eq(instagramMedia.id, mediaId))
//             .returning();

//         return updated;
//     }

//     /**
//      * Update media by Instagram ID
//      */
//     async updateMediaByInstagramId(
//         tenantId: string,
//         instagramId: string,
//         data: {
//             mediaUrl?: string;
//             caption?: string | null;
//             timestamp?: Date;
//         }
//     ) {
//         const [updated] = await this.db
//             .update(instagramMedia)
//             .set(data)
//             .where(and(eq(instagramMedia.tenantId, tenantId), eq(instagramMedia.instagramId, instagramId)))
//             .returning();

//         return updated;
//     }

//     /**
//      * Mark media as imported
//      */
//     async markAsImported(mediaId: string, productId: string) {
//         return await this.updateMedia(mediaId, {
//             isImported: true,
//             productId,
//         });
//     }

//     /**
//      * Create product from Instagram media
//      */
//     async createProductFromMedia(data: {
//         storeId: string;
//         tenantId: string;
//         title: string;
//         description?: string | null;
//         priceAmount: number;
//         status?: "draft" | "active" | "archived";
//     }) {
//         const [newProduct] = await this.db
//             .insert(products)
//             .values({
//                 storeId: data.storeId,
//                 tenantId: data.tenantId,
//                 title: data.title,
//                 description: data.description || null,
//                 basePriceAmount: data.priceAmount,
//                 baseCurrency: "KES",
//                 status: data.status || "draft",
//                 slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
//             })
//             .returning();

//         return newProduct;
//     }

//     /**
//      * Add product image
//      */
//     async addProductImage(data: {
//         productId: string;
//         url: string;
//         sortOrder?: number;
//     }) {
//         // We need tenantId
//         const [product] = await this.db.select({ tenantId: products.tenantId }).from(products).where(eq(products.id, data.productId)).limit(1);
//         if (!product) throw new Error("Product not found");

//         // Create media object
//         const [mediaObj] = await this.db.insert(mediaObjects).values({
//             tenantId: product.tenantId,
//             blobUrl: data.url
//         }).returning();

//         const [link] = await this.db
//             .insert(productMedia)
//             .values({
//                 tenantId: product.tenantId,
//                 productId: data.productId,
//                 mediaId: mediaObj.id,
//                 sortOrder: data.sortOrder || 0,
//             })
//             .returning();

//         return {
//             id: link.id,
//             productId: link.productId,
//             url: data.url,
//             sortOrder: link.sortOrder || 0
//         };
//     }

//     async createMediaObject(data: {
//         tenantId: string;
//         blobUrl: string;
//         blobPathname?: string | null;
//         contentType?: string | null;
//         sizeBytes?: number | null;
//         width?: number | null;
//         height?: number | null;
//         altText?: string | null;
//         isPublic?: boolean;
//         source?: string | null;
//     }) {
//         const [mediaObject] = await this.db
//             .insert(mediaObjects)
//             .values({
//                 tenantId: data.tenantId,
//                 blobUrl: data.blobUrl,
//                 blobPathname: data.blobPathname || null,
//                 contentType: data.contentType || null,
//                 sizeBytes: data.sizeBytes || null,
//                 width: data.width || null,
//                 height: data.height || null,
//                 altText: data.altText || null,
//                 isPublic: data.isPublic ?? true,
//                 source: data.source || null,
//             })
//             .returning();

//         return mediaObject;
//     }

//     async linkMediaToProduct(data: {
//         tenantId: string;
//         productId: string;
//         mediaId: string;
//         sortOrder?: number;
//         isFeatured?: boolean;
//     }) {
//         const [link] = await this.db
//             .insert(productMedia)
//             .values({
//                 tenantId: data.tenantId,
//                 productId: data.productId,
//                 mediaId: data.mediaId,
//                 sortOrder: data.sortOrder ?? 0,
//                 isFeatured: data.isFeatured ?? false,
//             })
//             .returning();

//         return link;
//     }

//     /**
//      * Bulk check which Instagram IDs already exist
//      */
//     async getExistingInstagramIds(instagramIds: string[]) {
//         const existing = await this.db
//             .select({ instagramId: instagramMedia.instagramId })
//             .from(instagramMedia)
//             .where(eq(instagramMedia.instagramId, instagramIds[0])); // TODO: Use IN operator

//         return new Set(existing.map((item) => item.instagramId));
//     }

//     /**
//      * Get media count for store
//      */
//     async getMediaCountForStore(storeId: string) {
//         const result = await this.db
//             .select()
//             .from(instagramMedia)
//             .where(eq(instagramMedia.storeId, storeId));

//         return result.length;
//     }

//     /**
//      * Get imported media count for store
//      */
//     async getImportedMediaCountForStore(storeId: string) {
//         const result = await this.db
//             .select()
//             .from(instagramMedia)
//             .where(
//                 and(
//                     eq(instagramMedia.storeId, storeId),
//                     eq(instagramMedia.isImported, true)
//                 )
//             );

//         return result.length;
//     }
// }

// /**
//  * Create Instagram queries instance
//  */
// export function createInstagramQueries(db: typeof edgeDb) {
//     return new InstagramQueries(db);
// }