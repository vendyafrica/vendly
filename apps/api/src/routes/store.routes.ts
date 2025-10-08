// apps/api/src/routes/store.routes.ts
import { Router } from "express";
import { storeController } from "../controllers/store.controller";

const router:Router = Router();

// Create store
router.post("/", (req, res) => storeController.createStore(req, res));

// Search stores
router.get("/search", (req, res) => storeController.searchStores(req, res));

// Get stores by category
router.get("/category/:category", (req, res) => storeController.getStoresByCategory(req, res));

// Get store by slug
router.get("/slug/:slug", (req, res) => storeController.getStoreBySlug(req, res));

// Get store by seller ID
router.get("/seller/:sellerId", (req, res) => storeController.getStoreBySellerId(req, res));

// Get store by ID
router.get("/:id", (req, res) => storeController.getStoreById(req, res));

// Update store
router.patch("/:id", (req, res) => storeController.updateStore(req, res));

// Update social links
router.patch("/:id/social", (req, res) => storeController.updateSocialLinks(req, res));

// Toggle active status
router.patch("/:id/status", (req, res) => storeController.toggleActiveStatus(req, res));

// Set custom domain
router.patch("/:id/domain", (req, res) => storeController.setCustomDomain(req, res));

// Increment product count
router.post("/:id/products/increment", (req, res) => storeController.incrementProductCount(req, res));

// Decrement product count
router.post("/:id/products/decrement", (req, res) => storeController.decrementProductCount(req, res));

console.log("[store.routes] Store routes initialized");

export default router;