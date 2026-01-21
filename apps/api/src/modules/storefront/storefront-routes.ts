import { Router } from "express";
import * as controller from "./storefront-controller";

const router:Router = Router();

// Public storefront routes - no auth required
router.get("/:slug", controller.getStoreData);
router.get("/:slug/categories", controller.getStoreCategories);
router.get("/:slug/products", controller.getStoreProducts);

export default router;
