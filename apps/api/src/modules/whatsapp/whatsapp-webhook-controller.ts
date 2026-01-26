
import { Request, Response } from "express";
import crypto from "crypto";
import { orderService } from "../orders/order-service";
import { whatsAppService } from "./whatsapp-service";

export class WhatsAppWebhookController {

    /**
     * Verify Webhook (GET)
     */
    async verify(req: Request, res: Response) {
        try {
            const mode = req.query["hub.mode"];
            const token = req.query["hub.verify_token"];
            const challenge = req.query["hub.challenge"];

            if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN) {
                console.log("✅ WhatsApp Webhook verified");
                return res.status(200).send(challenge);
            }

            return res.sendStatus(403);
        } catch (error) {
            console.error("WhatsApp verification error:", error);
            return res.sendStatus(500);
        }
    }

    /**
     * Handle Events (POST)
     */
    async handleEvent(req: Request, res: Response) {
        try {
            // 1. Verify Signature (TODO: Add X-Hub-Signature-256 check similar to Instagram)
            // For now, we trust the WA_VERIFY_TOKEN on setup, but production needs signature check.

            const body = req.body;

            // Check if this is a WhatsApp status update
            if (body.object === "whatsapp_business_account") {
                if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
                    const changes = body.entry[0].changes[0].value;
                    const message = changes.messages[0];
                    const senderPhone = message.from;

                    // Handle Interactive Button Replies
                    if (message.type === "interactive" && message.interactive.type === "button_reply") {
                        const payload = message.interactive.button_reply.id;
                        console.log(`📩 Button Clicked: ${payload} from ${senderPhone}`);

                        await this.handleButtonClick(payload, senderPhone);
                    }
                }
            }

            // Always acknowledge 200 OK
            return res.sendStatus(200);

        } catch (error) {
            console.error("WhatsApp webhook error:", error);
            return res.sendStatus(200);
        }
    }

    private async handleButtonClick(payload: string, senderPhone: string) {
        const [action, orderId] = payload.split(":");

        if (!action || !orderId) return;

        try {
            // In a real app, we would verify senderPhone matches the Store's phone 
            // to prevent unauthorized actions if someone guesses the payload.

            const tenantId = "default"; // TODO: Identify tenant from order or context

            if (action === "ACCEPT_ORDER") {
                await orderService.updateOrderStatus(orderId, tenantId, { status: "PREPARING" });
                await whatsAppService.sendPreparationTimer(senderPhone, orderId);
            }
            else if (action === "DECLINE_ORDER") {
                await orderService.updateOrderStatus(orderId, tenantId, { status: "CANCELLED" });
                // Notify Customer (Need to fetch customer phone from order, complicating this slightly)
                // For MVP, logging it. 
                console.log(`Order ${orderId} declined by seller.`);
            }
            else if (action === "RIDER_REQUEST") {
                // Future implementation
                console.log(`Rider requested for order ${orderId}`);
            }

        } catch (error) {
            console.error(`Failed to handle button action ${action}:`, error);
        }
    }
}

export const whatsAppWebhookController = new WhatsAppWebhookController();
