import { Request, Response } from "express";
import { orderService } from "./order-service";
import {
    createOrderSchema,
    updateOrderStatusSchema,
    orderQuerySchema,
} from "./order-models";
import { z } from "zod";

class OrderController {
    /**
     * Create order (from storefront)
     * POST /api/storefront/:slug/orders
     */
    async createFromStorefront(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const data = createOrderSchema.parse(req.body);

            const order = await orderService.createOrder(slug, data);

            return res.status(201).json({
                success: true,
                data: order,
            });
        } catch (error) {
            console.error("Create order error:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error.issues,
                });
            }
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to create order",
            });
        }
    }

    /**
     * List orders (admin)
     * GET /api/orders
     */
    async list(req: Request, res: Response) {
        try {
            const tenantId = req.headers["x-tenant-id"] as string;
            if (!tenantId) {
                return res.status(400).json({ error: "Tenant context missing" });
            }

            const filters = orderQuerySchema.parse(req.query);
            const result = await orderService.listOrders(tenantId, filters);

            return res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("List orders error:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Invalid query parameters",
                    details: error.issues,
                });
            }
            return res.status(500).json({ error: "Failed to fetch orders" });
        }
    }

    /**
     * Get single order (admin)
     * GET /api/orders/:id
     */
    async get(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.headers["x-tenant-id"] as string;

            if (!tenantId) {
                return res.status(400).json({ error: "Tenant context missing" });
            }

            const order = await orderService.getOrder(id, tenantId);

            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            return res.json({
                success: true,
                data: order,
            });
        } catch (error) {
            console.error("Get order error:", error);
            return res.status(500).json({ error: "Failed to fetch order" });
        }
    }

    /**
     * Update order status (admin)
     * PATCH /api/orders/:id/status
     */
    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.headers["x-tenant-id"] as string;

            if (!tenantId) {
                return res.status(400).json({ error: "Tenant context missing" });
            }

            const data = updateOrderStatusSchema.parse(req.body);
            const order = await orderService.updateOrderStatus(id, tenantId, data);

            return res.json({
                success: true,
                data: order,
            });
        } catch (error) {
            console.error("Update order status error:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error.issues,
                });
            }
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to update order",
            });
        }
    }

    /**
     * Get order statistics (admin)
     * GET /api/orders/stats
     */
    async getStats(req: Request, res: Response) {
        try {
            const tenantId = req.headers["x-tenant-id"] as string;

            if (!tenantId) {
                return res.status(400).json({ error: "Tenant context missing" });
            }

            const stats = await orderService.getOrderStats(tenantId);

            return res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            console.error("Get order stats error:", error);
            return res.status(500).json({ error: "Failed to fetch order stats" });
        }
    }
}

export const orderController = new OrderController();
