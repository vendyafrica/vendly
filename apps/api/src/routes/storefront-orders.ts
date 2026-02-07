import { Router } from "express";
import { createOrderSchema, orderService } from "../services/order-service";
import { notifySellerNewOrder } from "../services/notifications";
import { and, db, eq, isNull, stores } from "@vendly/db";
import { mtnMomoCollections } from "../services/mtn-momo-collections";
import { capturePosthogEvent } from "../utils/posthog";

export const storefrontOrdersRouter:Router = Router();

function getMtnCurrencyForOrder(orderCurrency: string): string {
  if (process.env.MTN_MOMO_COLLECTION_CURRENCY) return process.env.MTN_MOMO_COLLECTION_CURRENCY;
  const target = (process.env.MTN_MOMO_TARGET_ENV || "sandbox").toLowerCase();
  if (target === "sandbox") return "EUR"; // MTN sandbox commonly expects EUR
  return orderCurrency;
}

// POST /api/storefront/:slug/orders
storefrontOrdersRouter.post("/storefront/:slug/orders", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const input = createOrderSchema.parse(req.body);

    if (input.paymentMethod === "mtn_momo" && !input.customerPhone) {
      throw new Error("customerPhone is required for MTN MoMo payments");
    }

    const order = await orderService.createOrder(slug, input);

    capturePosthogEvent({
      distinctId: order.customerEmail || order.id,
      event: "order_created",
      properties: {
        orderId: order.id,
        storeSlug: slug,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        currency: order.currency,
      },
    });

    let momo: { referenceId: string } | null = null;
    if (order.paymentMethod === "mtn_momo") {
      const store = await db.query.stores.findFirst({
        where: and(eq(stores.slug, slug), isNull(stores.deletedAt)),
        columns: { id: true, tenantId: true },
      });

      if (!store) {
        throw new Error("Store not found");
      }

      const result = await mtnMomoCollections.requestToPay({
        amount: String(order.totalAmount),
        currency: getMtnCurrencyForOrder(order.currency),
        externalId: order.id,
        payerMsisdn: order.customerPhone || "",
        payerMessage: `Pay for ${order.orderNumber}`,
        payeeNote: "Vendly",
        callbackUrl: process.env.MTN_MOMO_CALLBACK_URL,
      });

      momo = { referenceId: result.referenceId };
    }

    // Fire-and-forget notification (do not block order creation if WhatsApp fails)
    void (async () => {
      try {
        console.log("[StorefrontOrders] Sending WhatsApp notification to seller", { slug, orderId: order.id });
        const sellerPhone = await orderService.getTenantPhoneByStoreSlug(slug);
        await notifySellerNewOrder({ sellerPhone, order });
      } catch (err) {
        console.error("[StorefrontOrders] Failed to notify seller on WhatsApp", err);
      }
    })();

    return res.status(201).json({ order, momo });
  } catch (err) {
    next(err);
  }
});
