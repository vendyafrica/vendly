import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { requireAuth, requireTenantRole } from "../middlewares/auth";
import { orderService, updateOrderStatusSchema } from "../services/order-service";

export const tenantOrdersRouter: ExpressRouter = Router();

// GET /api/tenants/:tenantId/orders
tenantOrdersRouter.get(
  "/tenants/:tenantId/orders",
  requireAuth,
  requireTenantRole(["owner", "admin", "support", "staff"]),
  async (req, res, next) => {
    try {
      const { tenantId } = req.params;
      const list = await orderService.listOrdersForTenant(tenantId);
      return res.json({ orders: list });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/tenants/:tenantId/orders/:orderId
tenantOrdersRouter.patch(
  "/tenants/:tenantId/orders/:orderId",
  requireAuth,
  requireTenantRole(["owner", "admin", "support", "staff"]),
  async (req, res, next) => {
    try {
      const { tenantId, orderId } = req.params;
      const input = updateOrderStatusSchema.parse(req.body);
      const updated = await orderService.updateOrderStatus(orderId, tenantId, input);
      return res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);
