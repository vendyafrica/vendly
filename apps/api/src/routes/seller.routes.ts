// apps/api/src/routes/seller.routes.ts
import { Router } from "express";
import { sellerController } from "../controllers/seller.controller";

const router:Router = Router();

// Create seller profile
router.post("/", (req, res) => sellerController.createSellerProfile(req, res));

// Get seller profile by ID
router.get("/:id", (req, res) => sellerController.getSellerProfile(req, res));

// Get seller profile by user ID
router.get("/user/:userId", (req, res) => sellerController.getSellerProfileByUserId(req, res));

// Update seller profile
router.patch("/:id", (req, res) => sellerController.updateSellerProfile(req, res));

// Update social connections
router.patch("/:id/social", (req, res) => sellerController.updateSocialConnections(req, res));

// Update verification status (admin only - add auth middleware later)
router.patch("/:id/verification", (req, res) => sellerController.updateVerificationStatus(req, res));

// Upgrade seller tier
router.post("/:id/upgrade", (req, res) => sellerController.upgradeTier(req, res));

console.log("[seller.routes] Seller routes initialized");

export default router;