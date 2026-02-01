import { Router } from "express";
import { requireAuth, requireTenantRole } from "../middlewares/auth";
import { orderService } from "../services/order-service";
import { notifySellerOrderPaid } from "../services/notifications";

export const orderSimulationsRouter = Router();

// POST /api/tenants/:tenantId/orders/:orderId/simulate-paid
orderSimulationsRouter.post(
  "/tenants/:tenantId/orders/:orderId/simulate-paid",
  requireAuth,
  requireTenantRole(["owner", "admin"]),
  async (req, res, next) => {
    try {
      const { tenantId, orderId } = req.params;

      const updated = await orderService.updateOrderStatus(orderId, tenantId, {
        paymentStatus: "paid",
        status: "processing",
      });

      const fullOrder = await orderService.getOrderById(orderId);
      if (fullOrder) {
        const sellerPhone = await orderService.getTenantPhoneByTenantId(tenantId);
        await notifySellerOrderPaid({ sellerPhone, order: fullOrder });
      }

      return res.json({ ok: true, order: updated });
    } catch (err) {
      next(err);
    }
  }
);
