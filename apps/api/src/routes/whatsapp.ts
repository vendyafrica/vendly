import crypto from "crypto";
import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import type { RawBodyRequest } from "../types/raw-body";
import { orderService } from "../services/order-service";
import { whatsappClient } from "../services/whatsapp/whatsapp-client";
import { notifyCustomerOrderAccepted, notifyCustomerOrderOutForDelivery } from "../services/notifications";

function formatSellerOrderDetails(order: { orderNumber: string; currency?: string | null; items?: Array<{ productName?: string | null; quantity?: number | null; unitPrice?: number | null; totalPrice?: number | null } | null>; customerPhone?: string | null; shippingAddress?: unknown; notes?: string | null }) {
  const lines: string[] = [];
  lines.push(`Order ${order.orderNumber} details:`);

  const currency = order.currency || "";
  const items = (order.items || []).filter(Boolean) as Array<{
    productName?: string | null;
    quantity?: number | null;
    unitPrice?: number | null;
    totalPrice?: number | null;
  }>;

  if (items.length) {
    lines.push("Items:");
    for (const item of items) {
      const qty = item.quantity ?? 0;
      const name = item.productName || "Item";
      const unit = item.unitPrice != null ? `${currency} ${item.unitPrice}` : undefined;
      const total = item.totalPrice != null ? `${currency} ${item.totalPrice}` : undefined;
      const pricePart = unit && total ? ` @ ${unit} = ${total}` : unit ? ` @ ${unit}` : total ? ` (total ${total})` : "";
      lines.push(`- ${qty}x ${name}${pricePart}`);
    }
  }

  if (order.customerPhone) {
    lines.push(`Customer phone: ${order.customerPhone}`);
  }

  const addr = asObject(order.shippingAddress);
  const street = typeof addr?.street === "string" ? addr.street : undefined;
  const city = typeof addr?.city === "string" ? addr.city : undefined;
  const country = typeof addr?.country === "string" ? addr.country : undefined;
  const addressParts = [street, city, country].filter(Boolean);
  if (addressParts.length) {
    lines.push(`Delivery address: ${addressParts.join(", ")}`);
  }

  if (order.notes) {
    lines.push(`Notes: ${order.notes}`);
  }

  return lines.join("\n");
}

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

function verifySignature(req: RawBodyRequest): boolean {
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
  });

  if (!ok) {
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

    const normalized = raw.toLowerCase();

    const tenantId = await orderService.getTenantIdByPhoneNumber(from);
    if (!tenantId) {
      console.warn("[WhatsAppWebhook] Could not map sender to tenant", { from, raw });
      return res.sendStatus(200);
    }

    // MVP command parsing:
    // - "accept" / "decline" / "ready" / "out"
    // - optionally: "accept ORD-0001"
    const parts = normalized.split(/\s+/).filter(Boolean);
    const action = parts[0];
    const maybeOrderNumber = parts.find((p: string) => p.startsWith("ord-"));

    const order = maybeOrderNumber
      ? await orderService.getOrderByOrderNumberForTenant(tenantId, maybeOrderNumber.toUpperCase())
      : action === "ready" || action === "out"
        ? await orderService.getLatestOrderForTenantByStatus(tenantId, ["processing"])
        : await orderService.getLatestOrderForTenantByStatus(tenantId, ["pending"]);

    if (!order) {
      await whatsappClient.sendTextMessage({
        to: from,
        body: "No matching order found. Reply like: ACCEPT ORD-0001, DECLINE ORD-0001, OUT ORD-0001, or READY ORD-0001.",
      });
      return res.sendStatus(200);
    }

    if (action === "accept") {
      await orderService.updateOrderStatus(order.id, tenantId, { status: "processing" });
      await whatsappClient.sendTextMessage({
        to: from,
        body: `Accepted ${order.orderNumber}. Reply READY ${order.orderNumber} when it is ready for pickup.`,
      });

      // Notify customer (best-effort)
      try {
        const full = await orderService.getOrderById(order.id);
        if (full) {
          await notifyCustomerOrderAccepted({ order: full });
        }
      } catch (err) {
        console.error("[WhatsAppWebhook] Failed to notify customer (accepted)", err);
      }

      // Follow-up details message (no template changes required)
      try {
        const full = await orderService.getOrderById(order.id);
        if (full) {
          await whatsappClient.sendTextMessage({
            to: from,
            body: formatSellerOrderDetails(full),
          });
        }
      } catch (err) {
        console.error("[WhatsAppWebhook] Failed to send order details", err);
      }
      return res.sendStatus(200);
    }

    if (action === "out") {
      // No DB status change for MVP. We only notify the customer.
      await whatsappClient.sendTextMessage({
        to: from,
        body: `Noted. We will notify the customer that ${order.orderNumber} is out for delivery.`,
      });

      try {
        const full = await orderService.getOrderById(order.id);
        if (full) {
          await notifyCustomerOrderOutForDelivery({ order: full });
        }
      } catch (err) {
        console.error("[WhatsAppWebhook] Failed to notify customer (out for delivery)", err);
      }

      return res.sendStatus(200);
    }

    if (action === "decline") {
      await orderService.updateOrderStatus(order.id, tenantId, { status: "cancelled" });
      await whatsappClient.sendTextMessage({
        to: from,
        body: `Declined ${order.orderNumber}.`,
      });
      return res.sendStatus(200);
    }

    if (action === "ready") {
      await orderService.updateOrderStatus(order.id, tenantId, { status: "completed" });
      await whatsappClient.sendTextMessage({
        to: from,
        body: `Marked ${order.orderNumber} as ready.`,
      });
      return res.sendStatus(200);
    }

    await whatsappClient.sendTextMessage({
      to: from,
      body: "Unknown command. Reply: ACCEPT, DECLINE, OUT, or READY (optionally with order number).",
    });
  } catch (err) {
    console.error("[WhatsAppWebhook] Handler error", err);
  }

  return res.sendStatus(200);
});
