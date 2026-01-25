import { Router } from "express";
import * as controller from "./storefront-controller";
import { orderController } from "../orders/order-controller";

const router: Router = Router();

// Public storefront routes - no auth required
router.get("/:slug", controller.getStoreData);
router.get("/:slug/categories", controller.getStoreCategories);
router.get("/:slug/products", controller.getStoreProducts);
router.get("/:slug/products/:productSlug", controller.getStoreProductBySlug);

// Order creation (public - customers can place orders)
router.post("/:slug/orders", orderController.createFromStorefront);

export default router;

