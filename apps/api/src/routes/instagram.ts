// import { Router } from "express";
// import { db } from "@vendly/db";
// import { instagramMedia, stores, tenants, account, products, productImages } from "@vendly/db/schema";
// import { eq, and, desc } from "drizzle-orm";
// import { auth } from "@vendly/auth";
// import crypto from "crypto";

// const router = Router();

// // Middleware to verify Instagram webhook signature
// const verifyInstagramSignature = (req: any, res: any, buf: Buffer) => {
//     const signature = req.headers["x-hub-signature-256"];
//     if (!signature) return; // Let the route handler decide if verification is mandatory (it is for webhooks)

//     const sha256 = crypto
//         .createHmac("sha256", process.env.INSTAGRAM_CLIENT_SECRET || process.env.BETTER_AUTH_SECRET || "")
//         .update(buf)
//         .digest("hex");

//     (req as any).isInstagramVerified = `sha256=${sha256}` === signature;
// };

// // GET /webhook - Verification Challenge
// router.get("/webhook", (req, res) => {
//     const mode = req.query["hub.mode"];
//     const token = req.query["hub.verify_token"];
//     const challenge = req.query["hub.challenge"];

//     // You should set this environment variable to a secure random string
//     const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || "vendly-instagram-verify-token";

//     if (mode && token) {
//         if (mode === "subscribe" && token === VERIFY_TOKEN) {
//             console.log("WEBHOOK_VERIFIED");
//             res.status(200).send(challenge);
//         } else {
//             res.sendStatus(403);
//         }
//     } else {
//         res.sendStatus(400);
//     }
// });

// // POST /webhook - Event Notification
// router.post("/webhook", (req, res) => {
//     // If you used the 'body-parser' verify/buffer options properly in server.ts, 
//     // you could verify the signature here. For simplicity in this structure, 
//     // assuming verification happened or we trust the source if behind a gateway.
//     // Ideally, use a middleware that computes the signature from the raw body.

//     // Note: To implement strict verification, we'd need access to the raw body buffer.
//     // Since server.ts uses express.json(), we typically add a verify callback there.
//     // For now, we will log the event and process it.

//     try {
//         const body = req.body;

//         console.log("Received webhook:", JSON.stringify(body, null, 2));

//         if (body.object === "instagram") {
//             // Handle Instagram events
//             body.entry?.forEach((entry: any) => {
//                 // Process changes...
//                 console.log("Entry:", entry);
//             });
//             res.status(200).send("EVENT_RECEIVED");
//         } else {
//             res.sendStatus(404);
//         }
//     } catch (error) {
//         console.error("Webhook error:", error);
//         res.sendStatus(500);
//     }
// });

// // POST /sync - Manual Sync from Frontend
// router.post("/sync", async (req, res) => {
//     try {
//         const session = await auth.api.getSession({ headers: req.headers });
//         if (!session) {
//             return res.status(401).json({ error: "Unauthorized" });
//         }

//         const { tenantSlug } = req.body;
//         if (!tenantSlug) {
//             return res.status(400).json({ error: "Missing tenantSlug" });
//         }

//         // 1. Get Tenant and Store
//         const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug));
//         if (!tenant) return res.status(404).json({ error: "Tenant not found" });

//         const [store] = await db.select().from(stores).where(eq(stores.tenantId, tenant.id));
//         if (!store) return res.status(404).json({ error: "Store not found" });

//         // 2. Get Instagram Account for User
//         const [igAccount] = await db
//             .select()
//             .from(account)
//             .where(and(eq(account.userId, session.user.id), eq(account.providerId, "instagram")));

//         if (!igAccount || !igAccount.accessToken) {
//             return res.status(400).json({ error: "Instagram account not connected" });
//         }

//         // 3. Fetch Media from Instagram Graph API
//         const mediaFields = "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp";
//         // Use v18.0 to match the auth version
//         const url = `https://graph.instagram.com/v18.0/me/media?fields=${mediaFields}&access_token=${igAccount.accessToken}`;

//         const response = await fetch(url);
//         const data = await response.json();

//         if (data.error) {
//             console.error("Instagram API Error:", data.error);
//             return res.status(400).json({ error: "Failed to fetch media from Instagram", details: data.error });
//         }

//         // 4. Save to DB and auto-import as draft products
//         const mediaItems = data.data || [];
//         const savedItems = [];

//         for (const item of mediaItems) {
//             // Check if media already exists
//             const [existingMedia] = await db
//                 .select()
//                 .from(instagramMedia)
//                 .where(eq(instagramMedia.instagramId, item.id));

//             if (existingMedia) {
//                 // Update existing media
//                 await db
//                     .update(instagramMedia)
//                     .set({
//                         mediaUrl: item.media_url,
//                         caption: item.caption || null,
//                         timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
//                     })
//                     .where(eq(instagramMedia.id, existingMedia.id));
//                 savedItems.push(item.id);
//                 continue;
//             }

//             // Insert new media
//             const [newMedia] = await db
//                 .insert(instagramMedia)
//                 .values({
//                     storeId: store.id,
//                     instagramId: item.id,
//                     mediaType: item.media_type,
//                     mediaUrl: item.media_url,
//                     thumbnailUrl: item.thumbnail_url || null,
//                     permalink: item.permalink,
//                     caption: item.caption || null,
//                     timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
//                     isImported: false,
//                 })
//                 .returning();

//             // Auto-import as draft product
//             const [newProduct] = await db.insert(products).values({
//                 storeId: store.id,
//                 title: newMedia.caption?.slice(0, 100) || "Instagram Post",
//                 description: newMedia.caption,
//                 priceAmount: 0,
//                 inventoryQuantity: 0,
//                 status: "draft",
//             }).returning();

//             // Create product image
//             await db.insert(productImages).values({
//                 productId: newProduct.id,
//                 url: newMedia.mediaType === "VIDEO" && newMedia.thumbnailUrl ? newMedia.thumbnailUrl : newMedia.mediaUrl,
//                 sortOrder: 0,
//             });

//             // Link media to product
//             await db.update(instagramMedia)
//                 .set({ isImported: true, productId: newProduct.id })
//                 .where(eq(instagramMedia.id, newMedia.id));

//             savedItems.push(item.id);
//         }

//         return res.json({ success: true, count: savedItems.length });

//     } catch (error: any) {
//         console.error("Sync error:", error);
//         return res.status(500).json({
//             error: "Internal Server Error",
//             details: error.message,
//             stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//         });
//     }
// });

// // GET /:tenantSlug/media - List synced media
// router.get("/:tenantSlug/media", async (req, res) => {
//     try {
//         const session = await auth.api.getSession({ headers: req.headers });
//         if (!session) return res.status(401).json({ error: "Unauthorized" });

//         const { tenantSlug } = req.params;

//         const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug));
//         if (!tenant) return res.status(404).json({ error: "Tenant not found" });

//         const [store] = await db.select().from(stores).where(eq(stores.tenantId, tenant.id));
//         if (!store) return res.status(404).json({ error: "Store not found" });

//         // Fetch media items from DB
//         const mediaItems = await db
//             .select()
//             .from(instagramMedia)
//             .where(
//                 and(
//                     eq(instagramMedia.storeId, store.id),
//                     eq(instagramMedia.isImported, false) // Only show non-imported ones? Or all? Let's show all for now or filter in UI
//                 )
//             )
//             .orderBy(desc(instagramMedia.timestamp));

//         return res.json(mediaItems);
//     } catch (error: any) {
//         console.error("Get media error:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // POST /import - Import media as Product
// router.post("/import", async (req, res) => {
//     try {
//         const session = await auth.api.getSession({ headers: req.headers });
//         if (!session) return res.status(401).json({ error: "Unauthorized" });

//         const { tenantSlug, mediaId, price, name } = req.body;

//         if (!mediaId) return res.status(400).json({ error: "Missing mediaId" });

//         const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug));
//         if (!tenant) return res.status(404).json({ error: "Tenant not found" });

//         const [store] = await db.select().from(stores).where(eq(stores.tenantId, tenant.id));
//         if (!store) return res.status(404).json({ error: "Store not found" });

//         // Get the media item
//         const [media] = await db
//             .select()
//             .from(instagramMedia)
//             .where(and(eq(instagramMedia.id, mediaId), eq(instagramMedia.storeId, store.id)));

//         if (!media) return res.status(404).json({ error: "Media not found" });

//         // Create Product with correct column names
//         const [newProduct] = await db.insert(products).values({
//             storeId: store.id,
//             title: name || media.caption?.slice(0, 100) || "Untitled Product",
//             description: media.caption,
//             priceAmount: price ? Math.round(price * 100) : 0, // Convert to cents
//             inventoryQuantity: 0,
//             status: "draft",
//         }).returning();

//         // Create product image from Instagram media
//         await db.insert(productImages).values({
//             productId: newProduct.id,
//             url: media.mediaType === "VIDEO" && media.thumbnailUrl ? media.thumbnailUrl : media.mediaUrl,
//             sortOrder: 0,
//         });

//         // Mark media as imported and link to product
//         await db.update(instagramMedia)
//             .set({ isImported: true, productId: newProduct.id })
//             .where(eq(instagramMedia.id, mediaId));

//         return res.json({ success: true, product: newProduct });

//     } catch (error: any) {
//         console.error("Import error:", error);
//         return res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// });

// export default router;
