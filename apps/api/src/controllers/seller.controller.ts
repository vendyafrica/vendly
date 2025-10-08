// apps/api/src/controllers/seller.controller.ts
import { Request, Response } from "express";
import { sellerService } from "../services/seller.service";
import { z } from "zod";

// Validation schemas
const createSellerProfileSchema = z.object({
  userId: z.string(),
  businessName: z.string().min(1),
  businessEmail: z.string().email(),
  businessPhone: z.string().min(1),
  country: z.enum(["KE", "UG"]),
  city: z.string().min(1),
  pickupAddress: z.string().min(1),
  whatsappPhone: z.string().optional(),
  payoutMethod: z.enum(["mobile_money", "bank"]),
  payoutDetails: z.object({
    mobileMoney: z.object({
      provider: z.string(),
      phone: z.string(),
    }).optional(),
    bank: z.object({
      accountName: z.string(),
      accountNumber: z.string(),
      bankName: z.string(),
      branch: z.string().optional(),
      swift: z.string().optional(),
    }).optional(),
  }),
});

const updateSellerProfileSchema = z.object({
  businessName: z.string().min(1).optional(),
  businessEmail: z.string().email().optional(),
  businessPhone: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  pickupAddress: z.string().min(1).optional(),
  whatsappPhone: z.string().optional(),
  payoutMethod: z.enum(["mobile_money", "bank"]).optional(),
  payoutDetails: z.object({
    mobileMoney: z.object({
      provider: z.string(),
      phone: z.string(),
    }).optional(),
    bank: z.object({
      accountName: z.string(),
      accountNumber: z.string(),
      bankName: z.string(),
      branch: z.string().optional(),
      swift: z.string().optional(),
    }).optional(),
  }).optional(),
});

const updateSocialConnectionsSchema = z.object({
  instagramConnected: z.boolean().optional(),
  igBusinessAccountId: z.string().nullable().optional(),
  fbPageId: z.string().nullable().optional(),
  waCatalogId: z.string().nullable().optional(),
});

const updateVerificationSchema = z.object({
  status: z.enum(["pending", "verified", "rejected"]),
  notes: z.string().optional(),
});

export class SellerController {
  /**
   * POST /api/sellers
   * Create a new seller profile
   */
  async createSellerProfile(req: Request, res: Response) {
    try {
      const data = createSellerProfileSchema.parse(req.body);
      
      // Check if user already has a seller profile
      const existing = await sellerService.hasSellerProfile(data.userId);
      if (existing) {
        return res.status(400).json({
          error: "User already has a seller profile",
        });
      }

      const sellerId = await sellerService.createSellerProfile(data);

      res.status(201).json({
        success: true,
        data: { sellerId },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[SellerController] Create failed:", error);
      res.status(500).json({ error: "Failed to create seller profile" });
    }
  }

  /**
   * GET /api/sellers/:id
   * Get seller profile by ID
   */
  async getSellerProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Seller ID is required" });
      }
      const profile = await sellerService.getSellerProfileById(id);

      if (!profile) {
        return res.status(404).json({ error: "Seller profile not found" });
      }

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error("[SellerController] Get failed:", error);
      res.status(500).json({ error: "Failed to get seller profile" });
    }
  }

  /**
   * GET /api/sellers/user/:userId
   * Get seller profile by user ID
   */
  async getSellerProfileByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const profile = await sellerService.getSellerProfileByUserId(userId);

      if (!profile) {
        return res.status(404).json({ error: "Seller profile not found" });
      }

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error("[SellerController] Get by user failed:", error);
      res.status(500).json({ error: "Failed to get seller profile" });
    }
  }

  /**
   * PATCH /api/sellers/:id
   * Update seller profile
   */
  async updateSellerProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Seller ID is required" });
      }
      const data = updateSellerProfileSchema.parse(req.body);

      const updated = await sellerService.updateSellerProfile(id, data);

      if (!updated) {
        return res.status(404).json({ error: "Seller profile not found or no changes made" });
      }

      res.json({
        success: true,
        message: "Seller profile updated successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[SellerController] Update failed:", error);
      res.status(500).json({ error: "Failed to update seller profile" });
    }
  }

  /**
   * PATCH /api/sellers/:id/social
   * Update social connections
   */
  async updateSocialConnections(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Seller ID is required" });
      }
      const data = updateSocialConnectionsSchema.parse(req.body);

      const updated = await sellerService.updateSocialConnections(id, data);

      if (!updated) {
        return res.status(404).json({ error: "Seller profile not found or no changes made" });
      }

      res.json({
        success: true,
        message: "Social connections updated successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[SellerController] Update social failed:", error);
      res.status(500).json({ error: "Failed to update social connections" });
    }
  }

  /**
   * PATCH /api/sellers/:id/verification
   * Update verification status (admin only)
   */
  async updateVerificationStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Seller ID is required" });
      }
      const data = updateVerificationSchema.parse(req.body);

      const updated = await sellerService.updateVerificationStatus(
        id,
        data.status,
        data.notes
      );

      if (!updated) {
        return res.status(404).json({ error: "Seller profile not found" });
      }

      res.json({
        success: true,
        message: "Verification status updated successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[SellerController] Update verification failed:", error);
      res.status(500).json({ error: "Failed to update verification status" });
    }
  }

  /**
   * POST /api/sellers/:id/upgrade
   * Upgrade seller tier
   */
  async upgradeTier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Seller ID is required" });
      }
      const { tier } = req.body;

      if (!tier || !["free", "pro"].includes(tier)) {
        return res.status(400).json({ error: "Invalid tier. Must be 'free' or 'pro'" });
      }

      const updated = await sellerService.upgradeTier(id, tier);

      if (!updated) {
        return res.status(404).json({ error: "Seller profile not found" });
      }

      res.json({
        success: true,
        message: `Seller tier upgraded to ${tier} successfully`,
      });
    } catch (error) {
      console.error("[SellerController] Upgrade tier failed:", error);
      res.status(500).json({ error: "Failed to upgrade tier" });
    }
  }
}

// Export singleton instance
export const sellerController = new SellerController();