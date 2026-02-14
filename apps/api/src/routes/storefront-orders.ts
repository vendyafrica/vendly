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

    // Fire-and-forget notification (do not block order creation if WhatsApp fails)
    void (async () => {
      try {
        const sellerPhone = await orderService.getTenantPhoneByStoreSlug(slug);

        console.log("[StorefrontOrders] Sending WhatsApp order received to customer", { slug, orderId: order.id });
        await notifyCustomerOrderReceived({ order });

        console.log("[StorefrontOrders] Sending WhatsApp new order to seller", { slug, orderId: order.id });
        await notifySellerNewOrder({ sellerPhone, order });
      } catch (err) {
        console.error("[StorefrontOrders] Failed to send WhatsApp notifications", err);
      }
    })();

    return res.status(201).json({ order, momo });
  } catch (err) {
    next(err);
  }
});
