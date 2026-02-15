import { Router } from "express";
import { createOrderSchema, orderService } from "../services/order-service";
import { notifyCustomerOrderReceived, notifySellerNewOrder } from "../services/notifications";
import { capturePosthogEvent } from "../shared/utils/posthog";

export const storefrontOrdersRouter:Router = Router();

// POST /api/storefront/:slug/orders
storefrontOrdersRouter.post("/storefront/:slug/orders", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const input = createOrderSchema.parse(req.body);

    // MTN MoMo temporarily disabled: allow order creation without phone validation
    // if (input.paymentMethod === "mtn_momo" && !input.customerPhone) {
    //   throw new Error("customerPhone is required for MTN MoMo payments");
    // }

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

    // MTN MoMo temporarily disabled: skip initiation
    const momo: { referenceId: string } | null = null;

    // Run notification enqueue within request lifecycle for serverless reliability.
    // Isolate failures so checkout success is never blocked by WhatsApp issues.
    await Promise.allSettled([
      (async () => {
        try {
          console.log("[StorefrontOrders] Sending WhatsApp order received to customer", { slug, orderId: order.id });
          await notifyCustomerOrderReceived({ order });
        } catch (err) {
          console.error("[StorefrontOrders] Failed to send customer WhatsApp notification", err);
        }
      })(),
      (async () => {
        try {
          const sellerPhone = await orderService.getTenantPhoneByStoreSlug(slug);
          console.log("[StorefrontOrders] Sending WhatsApp new order to seller", { slug, orderId: order.id });
          await notifySellerNewOrder({ sellerPhone, order });
        } catch (err) {
          console.error("[StorefrontOrders] Failed to send seller WhatsApp notification", err);
        }
      })(),
    ]);

    return res.status(201).json({ order, momo });
  } catch (err) {
    next(err);
  }
});
