/**
 * Instagram Controller (Updated)
 * Handles HTTP requests and responses for Instagram integration
 */
import { Request, Response } from "express";
import crypto from "crypto";
import { createInstagramService } from "./instagram-service";
import { getTcpDb } from "../db/db-client";
import {
    validateSyncOptions,
    validateImportOptions,
    validateWebhookVerification,
    WebhookVerificationParams,
    InstagramWebhookPayload,
} from "./instagram-model";

export class InstagramController {
    private readonly VERIFY_TOKEN =
        process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || "vendly-instagram-verify-token";

    /**
     * Get service instance with database client
     */
    private getService() {
        return createInstagramService(getTcpDb());
    }

    /**
     * Verify Instagram webhook signature
     */
    private verifyWebhookSignature(req: Request, body: Buffer): boolean {
        const signature = req.headers["x-hub-signature-256"];
        if (!signature || typeof signature !== "string") {
            return false;
        }

        const sha256 = crypto
            .createHmac(
                "sha256",
                process.env.INSTAGRAM_CLIENT_SECRET ||
                    process.env.BETTER_AUTH_SECRET ||
                    ""
            )
            .update(body)
            .digest("hex");

        return `sha256=${sha256}` === signature;
    }

    /**
     * GET /webhook - Webhook verification challenge
     */
    async verifyWebhook(req: Request, res: Response): Promise<void> {
        try {
            const params: Partial<WebhookVerificationParams> = {
                mode: req.query["hub.mode"] as string,
                token: req.query["hub.verify_token"] as string,
                challenge: req.query["hub.challenge"] as string,
            };

            // Validate params
            const validationError = validateWebhookVerification(params);
            if (validationError) {
                res.status(400).json({ error: validationError });
                return;
            }

            // Verify token
            if (params.mode === "subscribe" && params.token === this.VERIFY_TOKEN) {
                console.log("[InstagramController] Webhook verified");
                res.status(200).send(params.challenge);
            } else {
                console.log("[InstagramController] Webhook verification failed");
                res.sendStatus(403);
            }
        } catch (error) {
            console.error("[InstagramController] Webhook verification error:", error);
            res.status(500).json({
                error:
                    error instanceof Error
                        ? error.message
                        : "Webhook verification failed",
            });
        }
    }

    /**
     * POST /webhook - Receive webhook events
     */
    async handleWebhook(req: Request, res: Response): Promise<void> {
        try {
            const payload: InstagramWebhookPayload = req.body;

            console.log(
                "[InstagramController] Received webhook:",
                JSON.stringify(payload, null, 2)
            );

            if (payload.object === "instagram") {
                payload.entry?.forEach((entry) => {
                    console.log("[InstagramController] Processing entry:", entry);
                });

                res.status(200).send("EVENT_RECEIVED");
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.error("[InstagramController] Webhook handling error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Webhook handling failed",
            });
        }
    }

    /**
     * POST /sync - Sync Instagram media
     */
    async syncMedia(req: Request, res: Response): Promise<void> {
        try {
            const session = (req as any).session;
            if (!session) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const { tenantSlug, forceRefresh } = req.body;

            const options = {
                tenantSlug,
                userId: session.user.id,
                forceRefresh: forceRefresh === true,
            };

            const validationError = validateSyncOptions(options);
            if (validationError) {
                res.status(400).json({ error: validationError });
                return;
            }

            // Get service and perform sync
            const service = this.getService();
            const result = await service.syncMedia(options);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("[InstagramController] Sync error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Sync failed",
                details:
                    process.env.NODE_ENV === "development"
                        ? (error as Error).stack
                        : undefined,
            });
        }
    }

    /**
     * GET /:tenantSlug/media - Get media list
     */
    async getMediaList(req: Request, res: Response): Promise<void> {
        try {
            const session = (req as any).session;
            if (!session) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const { tenantSlug } = req.params;
            const showAll = req.query.showAll === "true";

            if (!tenantSlug) {
                res.status(400).json({ error: "tenantSlug is required" });
                return;
            }

            const service = this.getService();
            const mediaList = await service.getMediaList(tenantSlug, showAll);

            res.status(200).json({
                success: true,
                data: mediaList,
            });
        } catch (error) {
            console.error("[InstagramController] Get media list error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to get media list",
            });
        }
    }

    /**
     * POST /import - Import media as product
     */
    async importMedia(req: Request, res: Response): Promise<void> {
        try {
            const session = (req as any).session;
            if (!session) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const { tenantSlug, mediaId, price, name } = req.body;

            const options = {
                tenantSlug,
                userId: session.user.id,
                mediaId,
                price,
                name,
            };

            const validationError = validateImportOptions(options);
            if (validationError) {
                res.status(400).json({ error: validationError });
                return;
            }

            const service = this.getService();
            const result = await service.importMediaAsProduct(options);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("[InstagramController] Import error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Import failed",
                details:
                    process.env.NODE_ENV === "development"
                        ? (error as Error).stack
                        : undefined,
            });
        }
    }
}

export const instagramController = new InstagramController();