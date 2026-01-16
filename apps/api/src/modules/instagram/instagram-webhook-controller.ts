import { Request, Response } from "express";
import crypto from "crypto";
// import { instagramConnectionRepository } from "./instagram-repository";
// import { instagramMediaService } from "./instagram-media-service";
// import { productService } from "../products";
// import { mediaService } from "../media";

/**
 * Instagram Webhook Controller
 * Handles webhook verification and event processing from Instagram
 */
export class InstagramWebhookController {

    /**
     * Webhook Verification (GET request from Meta)
     * Meta will call this endpoint to verify your server
     */
    async verify(req: Request, res: Response) {
        try {
            const mode = req.query["hub.mode"];
            const token = req.query["hub.verify_token"];
            const challenge = req.query["hub.challenge"];

            console.log("📝 Webhook verification request:", { mode, token });

            // Verify the token matches what you set in Meta App Dashboard
            if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
                console.log("✅ Webhook verified successfully");
                // Respond with the challenge to complete verification
                return res.status(200).send(challenge);
            }

            console.log("❌ Webhook verification failed");
            return res.sendStatus(403);
        } catch (error) {
            console.error("Webhook verification error:", error);
            return res.sendStatus(500);
        }
    }

    /**
     * Webhook Event Handler (POST request from Meta)
     * Instagram calls this when events occur (new post, comment, etc.)
     */
    async handleEvent(req: Request, res: Response) {
        try {
            // 1. Verify the signature to ensure the request is from Instagram
            const signature = req.headers["x-hub-signature-256"] as string;

            if (!this.verifySignature(req.body, signature)) {
                console.log("❌ Invalid webhook signature");
                return res.sendStatus(403);
            }

            console.log("✅ Webhook signature verified");

            // 2. Process the webhook payload
            const { object, entry } = req.body;

            console.log("📨 Webhook received:", {
                object,
                entryCount: entry?.length || 0,
            });

            if (object === "instagram") {
                for (const item of entry) {
                    const instagramUserId = item.id;

                    console.log(`Processing changes for Instagram user: ${instagramUserId}`);

                    for (const change of item.changes) {
                        console.log("Change detected:", {
                            field: change.field,
                            value: change.value,
                        });

                        // Route to appropriate handler based on field
                        switch (change.field) {
                            case "media":
                                await this.handleNewMedia(instagramUserId, change.value);
                                break;
                            case "comments":
                                await this.handleComment(instagramUserId, change.value);
                                break;
                            case "mentions":
                                await this.handleMention(instagramUserId, change.value);
                                break;
                            default:
                                console.log(`Unhandled webhook field: ${change.field}`);
                        }
                    }
                }
            }

            // Always respond 200 OK quickly to acknowledge receipt
            // Instagram expects a response within 20 seconds
            return res.sendStatus(200);

        } catch (error) {
            console.error("Webhook processing error:", error);
            // Still return 200 to prevent Instagram from retrying
            return res.sendStatus(200);
        }
    }

    /**
     * Verify webhook signature from Instagram
     * Uses HMAC SHA256 to verify the request is authentic
     */
    private verifySignature(body: any, signature: string): boolean {
        if (!signature || !process.env.INSTAGRAM_CLIENT_SECRET) {
            return false;
        }

        try {
            const expectedSignature = crypto
                .createHmac("sha256", process.env.INSTAGRAM_CLIENT_SECRET)
                .update(JSON.stringify(body))
                .digest("hex");

            const receivedSignature = signature.replace("sha256=", "");

            return expectedSignature === receivedSignature;
        } catch (error) {
            console.error("Signature verification error:", error);
            return false;
        }
    }

    /**
     * Handle new media posted on Instagram
     * This is called when a user posts a new photo/video
     */
    private async handleNewMedia(instagramUserId: string, mediaData: any) {
        console.log("🎨 New media event:", { instagramUserId, mediaData });

        /* 
        TODO: Implement auto-import logic
        
        try {
          // 1. Get the connection from database
          const connection = await instagramConnectionRepository
            .getByInstagramUserId(instagramUserId);
          
          if (!connection) {
            console.log("No connection found for Instagram user:", instagramUserId);
            return;
          }
          
          // 2. Get full media details from Instagram API
          const media = await instagramMediaService.fetchMediaDetails(
            mediaData.media_id,
            connection.accessToken
          );
          
          // Skip if video (or handle differently)
          if (media.media_type === "VIDEO") {
            console.log("Skipping video post");
            return;
          }
          
          // 3. Create product automatically
          const product = await productService.createProduct(
            connection.tenantId,
            connection.tenantSlug,
            {
              storeId: connection.defaultStoreId,
              title: this.extractTitle(media.caption),
              description: media.caption,
              priceAmount: 0, // User can edit later
              currency: "KES",
              source: "instagram",
              sourceId: media.id,
              sourceUrl: media.permalink,
              isFeatured: false,
            },
            []
          );
          
          // 4. Download and attach Instagram media
          await mediaService.createProductMediaFromUrl(
            connection.tenantId,
            connection.tenantSlug,
            product.id,
            media.media_url,
            {
              source: "instagram",
              sourceMediaId: media.id,
              sourceMetadata: {
                permalink: media.permalink,
                username: media.username,
                timestamp: media.timestamp,
              },
            }
          );
          
          console.log(`✅ Auto-imported product from Instagram post ${media.id}`);
          
          // TODO: Send notification to user about new product
          
        } catch (error) {
          console.error("Failed to auto-import media:", error);
        }
        */
    }

    /**
     * Handle comments on Instagram posts
     */
    private async handleComment(instagramUserId: string, commentData: any) {
        console.log("💬 Comment event:", { instagramUserId, commentData });

        /*
        TODO: Implement comment handling
        - Store comment in database
        - Send notification to user
        - Optionally auto-reply
        */
    }

    /**
     * Handle @mentions on Instagram
     */
    private async handleMention(instagramUserId: string, mentionData: any) {
        console.log("@️ Mention event:", { instagramUserId, mentionData });

        /*
        TODO: Implement mention handling
        - Notify user they were mentioned
        - Optionally create product from mentioned post
        */
    }

    /**
     * Helper: Extract title from Instagram caption
     */
    private extractTitle(caption?: string): string {
        if (!caption) return "Instagram Product";

        // Get first line, remove hashtags and @mentions
        const firstLine = caption.split("\n")[0];
        const cleaned = firstLine
            .replace(/#\w+/g, "") // Remove hashtags
            .replace(/@\w+/g, "") // Remove mentions
            .trim();

        return cleaned.substring(0, 100) || "Instagram Product";
    }
}

export const instagramWebhookController = new InstagramWebhookController();
