import { Router } from "express";
import { orderController } from "./order-controller";

const router = Router();

// Get order statistics (must be before /:id to avoid conflict)
router.get("/stats", orderController.getStats);

// List orders
router.get("/", orderController.list);

// Get single order
router.get("/:id", orderController.get);

// Update order status
router.patch("/:id/status", orderController.updateStatus);

export const orderRoutes: Router = router;
