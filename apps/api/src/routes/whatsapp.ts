import crypto from "crypto";
import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import type { RawBodyRequest } from "../types/raw-body";
import { orderService } from "../services/order-service";
import { whatsappClient } from "../services/whatsapp/whatsapp-client";
import {
  notifyCustomerOrderAccepted,
  notifyCustomerOrderReady,
  notifyCustomerOutForDelivery,
  notifyCustomerOrderDelivered,
  notifyCustomerOrderDeclined,
  notifySellerCustomerDetails,
  notifySellerOrderDetails,
  notifySellerMarkReady,
  notifySellerOutForDelivery,
  notifySellerOrderCompleted,
} from "../services/notifications";

export const whatsappRouter: ExpressRouter = Router();

// GET /api/webhooks/whatsapp (Meta verification)
whatsappRouter.get("/webhooks/whatsapp", (req, res) => {
  const modeRaw = req.query["hub.mode"];
  const tokenRaw = req.query["hub.verify_token"];
  const challengeRaw = req.query["hub.challenge"];

  const mode = Array.isArray(modeRaw) ? modeRaw[0] : modeRaw;
  const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw;
  const challenge = Array.isArray(challengeRaw) ? challengeRaw[0] : challengeRaw;

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  console.log("[WhatsApp Verify]", {
    mode,
    token,
    challenge,
    hasVerifyToken: Boolean(verifyToken),
    tokenMatches: Boolean(verifyToken && token && String(token) === String(verifyToken)),
  });

  if (mode === "subscribe" && verifyToken && token && String(token) === String(verifyToken)) {
    return res.status(200).send(String(challenge || ""));
  }

  return res.sendStatus(403);
});

function timingSafeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

const BYPASS_SIGNATURE = process.env.WHATSAPP_BYPASS_SIGNATURE === "true" || process.env.NODE_ENV === "development";

function verifySignature(req: RawBodyRequest): boolean {
  if (BYPASS_SIGNATURE) {
    return true;
  }

  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return false;

  const signature = req.header("x-hub-signature-256") || "";
  const raw = req.rawBody;
  if (!raw) return false;

  const hash = crypto.createHmac("sha256", appSecret).update(raw).digest("hex");
  const expected = `sha256=${hash}`;

  return timingSafeEqual(signature, expected);
}

function asObject(v: unknown): Record<string, unknown> | null {
  if (typeof v !== "object" || v === null) return null;
  return v as Record<string, unknown>;
}

// POST /api/webhooks/whatsapp (incoming events)
whatsappRouter.post("/webhooks/whatsapp", async (req, res) => {
  // Meta expects 200 quickly. We log now; later we can enqueue to DB/outbox.
  const rawReq = req as RawBodyRequest;
  const signatureHeader = req.header("x-hub-signature-256") || "";
  const hasRawBody = Boolean(rawReq.rawBody);
  const rawLen = rawReq.rawBody ? rawReq.rawBody.length : 0;
  const hasAppSecret = Boolean(process.env.WHATSAPP_APP_SECRET);

  const ok = verifySignature(rawReq);
  console.log("[WhatsAppWebhook] Incoming", {
    path: req.path,
    hasSignatureHeader: Boolean(signatureHeader),
    hasRawBody,
    rawLen,
    hasAppSecret,
    signatureOk: ok,
    bypassSignature: BYPASS_SIGNATURE,
  });

  if (!ok) {
    console.warn("[WhatsAppWebhook] Signature failed; returning 403", { hasSignatureHeader: Boolean(signatureHeader), hasRawBody, rawLen });
    return res.sendStatus(403);
  }

  const payload: unknown = req.body;

  try {
    const payloadObj = asObject(payload);
    const entry = (payloadObj?.entry as unknown as unknown[] | undefined)?.[0];
    const entryObj = asObject(entry);
    const changes = (entryObj?.changes as unknown as unknown[] | undefined)?.[0];
    const changesObj = asObject(changes);
    const value = asObject(changesObj?.value);
    const messages = (value?.messages as unknown as unknown[] | undefined)?.[0];
    const message = asObject(messages);
    if (!message) {
      return res.sendStatus(200);
    }

    const from = typeof message.from === "string" ? message.from : undefined;
    if (!from) {
      return res.sendStatus(200);
    }

    // Meta webhooks can send:
    // - type: "button" with message.button.text
    // - type: "interactive" with message.interactive.button_reply.title
    // - type: "text" with message.text.body
    const type = typeof message.type === "string" ? message.type : undefined;

    const textBody =
      (type === "text" ? (asObject(message.text)?.body as string | undefined) : undefined) ||
      (type === "button" ? (asObject(message.button)?.text as string | undefined) : undefined) ||
      (type === "interactive"
        ? ((asObject(asObject(message.interactive)?.button_reply)?.title as string | undefined) ?? undefined)
        : undefined);

    const raw = String(textBody || "").trim();
    if (!raw) {
      return res.sendStatus(200);
    }

    console.log("[WhatsAppWebhook] Message", { from, type, raw });

    const normalized = raw.toLowerCase().trim();

    // -----------------------------------------------------------------------
    // Buyer "I PAID" quick reply — sender is NOT a tenant (seller)
    // -----------------------------------------------------------------------
    if (normalized === "i paid") {
      // Look up the latest pending-payment order for this buyer phone
      const buyerOrder = await orderService.getLatestOrderByCustomerPhone(from, ["pending"]);
      if (!buyerOrder) {
        await whatsappClient.sendTextMessage({
          to: from,
          body: "We could not find a pending order for your number. If you have paid, please wait for confirmation.",
        });
        return res.sendStatus(200);
      }

      // Simulated: mark payment as paid
      await orderService.updateOrderStatusByOrderId(buyerOrder.id, { paymentStatus: "paid" });

      await whatsappClient.sendTextMessage({
        to: from,
        body: `Thank you! We have noted your payment for order ${buyerOrder.orderNumber}. The seller will be notified.`,
      });

      // Notify seller about the paid order
      try {
        const full = await orderService.getOrderById(buyerOrder.id);
        if (full) {
          const sellerPhone = await orderService.getTenantPhoneByTenantId(full.tenantId);
          const { notifySellerNewOrder } = await import("../services/notifications");
          await notifySellerNewOrder({ sellerPhone, order: full });
        }
      } catch (err) {
        console.error("[WhatsAppWebhook] Failed to notify seller after I PAID", err);
      }

      return res.sendStatus(200);
    }

    // -----------------------------------------------------------------------
    // Seller commands: ACCEPT, DECLINE, READY, OUT, DELIVERED
    // -----------------------------------------------------------------------
    const tenantId = await orderService.getTenantIdByPhoneNumber(from);
    if (!tenantId) {
      const buyerOrder = await orderService.getLatestOrderByCustomerPhone(from, ["pending"]);
      if (!buyerOrder) {
        console.warn("[WhatsAppWebhook] Could not map sender to tenant or buyer order", { from, raw });
        return res.sendStatus(200);
      }

      await whatsappClient.sendTextMessage({
        to: from,
        body: `Thanks for your order ${buyerOrder.orderNumber}! Payments are manual for now. Please pay the store directly, then reply "I PAID" once done.`,
      });
      return res.sendStatus(200);
    }

    const parts = normalized.split(/\s+/).filter(Boolean);
    const action = parts[0];
    const maybeOrderNumber = parts.find((p: string) => p.startsWith("ord-"));

    const order = maybeOrderNumber
      ? await orderService.getOrderByOrderNumberForTenant(tenantId, maybeOrderNumber.toUpperCase())
      : action === "ready"
        ? await orderService.getLatestOrderForTenantByStatus(tenantId, ["processing"])
        : action === "out"
          ? await orderService.getLatestOrderForTenantByStatus(tenantId, ["ready"])
          : action === "delivered"
            ? await orderService.getLatestOrderForTenantByStatus(tenantId, ["out_for_delivery"])
            : await orderService.getLatestOrderForTenantByStatus(tenantId, ["pending"]);

    if (!order) {
      await whatsappClient.sendTextMessage({
        to: from,
        body: "No matching order found. Reply like: ACCEPT ORD-0001, DECLINE ORD-0001, READY ORD-0001, OUT ORD-0001, or DELIVERED ORD-0001.",
      });
      return res.sendStatus(200);
    }

    const sellerPhone = await orderService.getTenantPhoneByTenantId(tenantId);

    if (action === "accept") {
      await orderService.updateOrderStatus(order.id, tenantId, { status: "processing" });

      // Send seller: customer details + order details (with READY button)
      try {
        const full = await orderService.getOrderById(order.id);
        if (full) {
          const sellerPhone = await orderService.getTenantPhoneByTenantId(full.tenantId);
          console.log("[WhatsAppWebhook] ACCEPT sending seller customer details", {
            orderId: full.id,
            orderNumber: full.orderNumber,
            sellerPhone,
          });
          await notifySellerCustomerDetails({ sellerPhone, order: full });

          console.log("[WhatsAppWebhook] ACCEPT sending seller order details", {
            orderId: full.id,
            orderNumber: full.orderNumber,
            sellerPhone,
          });
          await notifySellerOrderDetails({ sellerPhone, order: full });

          console.log("[WhatsAppWebhook] ACCEPT sending customer ready/accepted", {
            orderId: full.id,
            orderNumber: full.orderNumber,
            customerPhone: full.customerPhone,
          });
          await notifyCustomerOrderAccepted({ order: full });
        }
      } catch (err) {
        console.error("[WhatsAppWebhook] Failed to send accept notifications", err);
      }
      return res.sendStatus(200);
    }

    if (action === "decline") {
      await orderService.updateOrderStatus(order.id, tenantId, { status: "cancelled" });

      // Notify buyer their order was declined
      try {
        const full = await orderService.getOrderById(order.id);
        if (full) {
          await notifyCustomerOrderDeclined({ order: full });
        }
      } catch (err) {
        console.error("[WhatsAppWebhook] Failed to notify customer (declined)", err);
      }

      await whatsappClient.sendTextMessage({
        to: from,
        body: `Declined ${order.orderNumber}.`,
      });
      return res.sendStatus(200);
    }

    if (action === "ready") {
      await orderService.updateOrderStatus(order.id, tenantId, { status: "ready" });

      try {
        const full = await orderService.getOrderById(order.id);
        if (full) {
          await notifySellerMarkReady({ sellerPhone, order: full });
          await notifyCustomerOrderReady({ order: full });
        }
      } catch (err) {
        console.error("[WhatsAppWebhook] Failed to send ready notifications", err);
      }
      return res.sendStatus(200);
    }

    if (action === "out") {
      await orderService.updateOrderStatus(order.id, tenantId, { status: "out_for_delivery" });

      const riderDetails = "Vendly Rider (+256700000000)";
      try {
        const full = await orderService.getOrderById(order.id);
        if (full) {
          await notifySellerOutForDelivery({ sellerPhone, order: full, riderDetails });
          await notifyCustomerOutForDelivery({ order: full, riderDetails });
        }
      } catch (err) {
        console.error("[WhatsAppWebhook] Failed to send out-for-delivery notifications", err);
      }
      return res.sendStatus(200);
    }

    if (action === "delivered") {
      await orderService.updateOrderStatus(order.id, tenantId, { status: "completed" });

      try {
        const full = await orderService.getOrderById(order.id);
        if (full) {
          await notifySellerOrderCompleted({ sellerPhone, order: full });
          await notifyCustomerOrderDelivered({ order: full });
        }
      } catch (err) {
        console.error("[WhatsAppWebhook] Failed to send delivered notifications", err);
      }
      return res.sendStatus(200);
    }

    await whatsappClient.sendTextMessage({
      to: from,
      body: "Unknown command. Reply: ACCEPT, DECLINE, READY, OUT, or DELIVERED (optionally with order number).",
    });
  } catch (err) {
    console.error("[WhatsAppWebhook] Handler error", err);
  }

  return res.sendStatus(200);
});
