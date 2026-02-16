import { Router } from "express";
import { createOrderSchema, orderService } from "../services/order-service";
// import { notifyCustomerOrderReceived, notifySellerNewOrder } from "../services/notifications";
import { mtnMomoCollections } from "../modules/payments/mtn-momo-service";
import { normalizePhoneToE164 } from "../shared/utils/phone";
import { capturePosthogEvent } from "../shared/utils/posthog";

export const storefrontOrdersRouter:Router = Router();

function getMtnCurrencyForOrder(orderCurrency: string): string {
  return process.env.MTN_MOMO_COLLECTION_CURRENCY || orderCurrency;
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

    let momo: { referenceId: string; status: "pending" } | { error: string; status: "failed" } | null = null;
    if (order.paymentMethod === "mtn_momo") {
      try {
        const payerMsisdn = normalizePhoneToE164(order.customerPhone || "", {
          defaultCountryCallingCode: process.env.DEFAULT_COUNTRY_CALLING_CODE || "256",
        });

        if (!payerMsisdn) {
          throw new Error("Invalid customer phone number for MTN MoMo payment");
        }

        const result = await mtnMomoCollections.requestToPay({
          amount: String(order.totalAmount),
          currency: getMtnCurrencyForOrder(order.currency),
          externalId: order.id,
          payerMsisdn,
          payerMessage: `Payment for ${order.orderNumber}`,
          payeeNote: `Order ${order.orderNumber}`,
          callbackUrl: process.env.MTN_MOMO_CALLBACK_URL,
        });

        momo = { referenceId: result.referenceId, status: "pending" };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to initiate MTN MoMo payment";
        console.error("[StorefrontOrders] MTN MoMo initiation failed", { orderId: order.id, message });
        await orderService.updateOrderStatus(order.id, order.tenantId, { paymentStatus: "failed" });
        momo = { error: message, status: "failed" };
      }
    }

    // WhatsApp notifications temporarily disabled for sandbox/Postman testing.
    // await Promise.allSettled([
    //   (async () => {
    //     try {
    //       console.log("[StorefrontOrders] Sending WhatsApp order received to customer", { slug, orderId: order.id });
    //       await notifyCustomerOrderReceived({ order });
    //     } catch (err) {
    //       console.error("[StorefrontOrders] Failed to send customer WhatsApp notification", err);
    //     }
    //   })(),
    //   (async () => {
    //     try {
    //       const sellerPhone = await orderService.getTenantPhoneByStoreSlug(slug);
    //       console.log("[StorefrontOrders] Sending WhatsApp new order to seller", { slug, orderId: order.id });
    //       await notifySellerNewOrder({ sellerPhone, order });
    //     } catch (err) {
    //       console.error("[StorefrontOrders] Failed to send seller WhatsApp notification", err);
    //     }
    //   })(),
    // ]);

    return res.status(201).json({ order, momo });
  } catch (err) {
    next(err);
  }
});
