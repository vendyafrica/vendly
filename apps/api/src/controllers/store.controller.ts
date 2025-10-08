// apps/api/src/controllers/store.controller.ts
import { Request, Response } from "express";
import { storeService } from "../services/store.service";
import { z } from "zod";

// Validation schemas
const createStoreSchema = z.object({
  sellerId: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  country: z.enum(["KE", "UG"]),
  currency: z.enum(["KES", "UGX"]),
  city: z.string().min(1),
  pickupAddress: z.string().min(1),
  primaryCategory: z.string().min(1),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  templateId: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  marketplaceListed: z.boolean().optional(),
});

const updateStoreSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  tagline: z.string().optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  templateId: z.string().optional(),
  city: z.string().min(1).optional(),
  pickupAddress: z.string().min(1).optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  primaryCategory: z.string().min(1).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  returnPolicy: z.string().optional(),
  shippingPolicy: z.string().optional(),
  privacyPolicy: z.string().optional(),
  termsOfService: z.string().optional(),
  operatingHours: z.record(z.string()).nullable().optional(),
  marketplaceListed: z.boolean().optional(),
  aboutSection: z.string().optional(),
  announcement: z.string().optional(),
  announcementActive: z.boolean().optional(),
});

const updateSocialLinksSchema = z.object({
  instagramUrl: z.string().url().nullable().optional(),
  facebookUrl: z.string().url().nullable().optional(),
  twitterUrl: z.string().url().nullable().optional(),
  tiktokUrl: z.string().url().nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
});

export class StoreController {
  /**
   * POST /api/stores
   * Create a new store
   */
  async createStore(req: Request, res: Response) {
    try {
      const data = createStoreSchema.parse(req.body);
      const storeId = await storeService.createStore(data);

      res.status(201).json({
        success: true,
        data: { storeId },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[StoreController] Create failed:", error);
      res.status(500).json({ error: "Failed to create store" });
    }
  }

  /**
   * GET /api/stores/:id
   * Get store by ID
   */
  async getStoreById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const store = await storeService.getStoreById(id);

      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }

      res.json({
        success: true,
        data: store,
      });
    } catch (error) {
      console.error("[StoreController] Get by ID failed:", error);
      res.status(500).json({ error: "Failed to get store" });
    }
  }

  /**
   * GET /api/stores/slug/:slug
   * Get store by slug
   */
  async getStoreBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({ error: "Store slug is required" });
      }

      const store = await storeService.getStoreBySlug(slug);

      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }

      res.json({
        success: true,
        data: store,
      });
    } catch (error) {
      console.error("[StoreController] Get by slug failed:", error);
      res.status(500).json({ error: "Failed to get store" });
    }
  }

  /**
   * GET /api/stores/seller/:sellerId
   * Get store by seller ID
   */
  async getStoreBySellerId(req: Request, res: Response) {
    try {
      const { sellerId } = req.params;
      if (!sellerId) {
        return res.status(400).json({ error: "Seller ID is required" });
      }

      const store = await storeService.getStoreBySellerId(sellerId);

      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }

      res.json({
        success: true,
        data: store,
      });
    } catch (error) {
      console.error("[StoreController] Get by seller failed:", error);
      res.status(500).json({ error: "Failed to get store" });
    }
  }

  /**
   * GET /api/stores/category/:category
   * Get stores by category
   */
  async getStoresByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      if (!category) {
        return res.status(400).json({ error: "Category is required" });
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const stores = await storeService.getStoresByCategory(category, limit, offset);

      res.json({
        success: true,
        data: stores,
        pagination: {
          limit,
          offset,
          count: stores.length,
        },
      });
    } catch (error) {
      console.error("[StoreController] Get by category failed:", error);
      res.status(500).json({ error: "Failed to get stores" });
    }
  }

  /**
   * GET /api/stores/search
   * Search stores
   */
  async searchStores(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const stores = await storeService.searchStores(query, limit, offset);

      res.json({
        success: true,
        data: stores,
        pagination: {
          limit,
          offset,
          count: stores.length,
        },
      });
    } catch (error) {
      console.error("[StoreController] Search failed:", error);
      res.status(500).json({ error: "Failed to search stores" });
    }
  }

  /**
   * PATCH /api/stores/:id
   * Update store
   */
  async updateStore(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const data = updateStoreSchema.parse(req.body);
      const updated = await storeService.updateStore(id, data);

      if (!updated) {
        return res.status(404).json({ error: "Store not found or no changes made" });
      }

      res.json({
        success: true,
        message: "Store updated successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[StoreController] Update failed:", error);
      res.status(500).json({ error: "Failed to update store" });
    }
  }

  /**
   * PATCH /api/stores/:id/social
   * Update store social links
   */
  async updateSocialLinks(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const data = updateSocialLinksSchema.parse(req.body);
      const updated = await storeService.updateSocialLinks(id, data);

      if (!updated) {
        return res.status(404).json({ error: "Store not found or no changes made" });
      }

      res.json({
        success: true,
        message: "Social links updated successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[StoreController] Update social links failed:", error);
      res.status(500).json({ error: "Failed to update social links" });
    }
  }

  /**
   * PATCH /api/stores/:id/status
   * Toggle store active status
   */
  async toggleActiveStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const { isActive } = req.body;
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "isActive must be a boolean" });
      }

      const updated = await storeService.toggleActiveStatus(id, isActive);

      if (!updated) {
        return res.status(404).json({ error: "Store not found" });
      }

      res.json({
        success: true,
        message: `Store ${isActive ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("[StoreController] Toggle status failed:", error);
      res.status(500).json({ error: "Failed to toggle store status" });
    }
  }

  /**
   * PATCH /api/stores/:id/domain
   * Set custom domain
   */
  async setCustomDomain(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const { domain } = req.body;
      const updated = await storeService.setCustomDomain(id, domain || null);

      if (!updated) {
        return res.status(404).json({ error: "Store not found" });
      }

      res.json({
        success: true,
        message: domain ? "Custom domain set successfully" : "Custom domain removed successfully",
      });
    } catch (error) {
      console.error("[StoreController] Set domain failed:", error);
      res.status(500).json({ error: "Failed to set custom domain" });
    }
  }

  /**
   * POST /api/stores/:id/products/increment
   * Increment product count
   */
  async incrementProductCount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const amount = parseInt(req.body.amount) || 1;
      const updated = await storeService.incrementProductCount(id, amount);

      if (!updated) {
        return res.status(404).json({ error: "Store not found" });
      }

      res.json({
        success: true,
        message: "Product count incremented successfully",
      });
    } catch (error) {
      console.error("[StoreController] Increment count failed:", error);
      res.status(500).json({ error: "Failed to increment product count" });
    }
  }

  /**
   * POST /api/stores/:id/products/decrement
   * Decrement product count
   */
  async decrementProductCount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const amount = parseInt(req.body.amount) || 1;
      const updated = await storeService.decrementProductCount(id, amount);

      if (!updated) {
        return res.status(404).json({ error: "Store not found" });
      }

      res.json({
        success: true,
        message: "Product count decremented successfully",
      });
    } catch (error) {
      console.error("[StoreController] Decrement count failed:", error);
      res.status(500).json({ error: "Failed to decrement product count" });
    }
  }
}

// Export singleton instance
export const storeController = new StoreController();