import { Router } from "express";
import { createOrderSchema, orderService } from "../services/order-service";
import { notifySellerNewOrder } from "../services/notifications";

export const storefrontOrdersRouter = Router();

// POST /api/storefront/:slug/orders
storefrontOrdersRouter.post("/storefront/:slug/orders", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const input = createOrderSchema.parse(req.body);

    const order = await orderService.createOrder(slug, input);

    // Fire-and-forget notification (do not block order creation if WhatsApp fails)
    void (async () => {
      try {
        const sellerPhone = await orderService.getTenantPhoneByStoreSlug(slug);
        await notifySellerNewOrder({ sellerPhone, order });
      } catch (err) {
        console.error("[StorefrontOrders] Failed to notify seller on WhatsApp", err);
      }
    })();

    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});
