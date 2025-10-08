// apps/api/src/controllers/import.controller.ts
import { Request, Response } from "express";
import { importService } from "../services/import.service";
import { z } from "zod";

// Validation schemas
const instagramConnectionSchema = z.object({
  igBusinessAccountId: z.string().min(1),
  fbPageId: z.string().min(1),
  accessToken: z.string().min(1),
});

const whatsappConnectionSchema = z.object({
  waCatalogId: z.string().min(1),
  accessToken: z.string().min(1),
});

export class ImportController {
  /**
   * POST /api/import/instagram
   * Import products from Instagram
   */
  async importFromInstagram(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const connection = instagramConnectionSchema.parse(req.body);
      const result = await importService.importFromInstagram(storeId, connection);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Import completed with errors",
          result,
        });
      }

      res.json({
        success: true,
        message: "Instagram import completed successfully",
        result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[ImportController] Instagram import failed:", error);
      res.status(500).json({ error: "Failed to import from Instagram" });
    }
  }

  /**
   * POST /api/import/whatsapp
   * Import products from WhatsApp Business Catalog
   */
  async importFromWhatsApp(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const connection = whatsappConnectionSchema.parse(req.body);
      const result = await importService.importFromWhatsAppCatalog(storeId, connection);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Import completed with errors",
          result,
        });
      }

      res.json({
        success: true,
        message: "WhatsApp catalog import completed successfully",
        result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[ImportController] WhatsApp import failed:", error);
      res.status(500).json({ error: "Failed to import from WhatsApp" });
    }
  }

  /**
   * POST /api/import/instagram/sync
   * Sync products from Instagram (update existing + import new)
   */
  async syncInstagramProducts(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const connection = instagramConnectionSchema.parse(req.body);
      const result = await importService.syncInstagramProducts(storeId, connection);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Sync completed with errors",
          result,
        });
      }

      res.json({
        success: true,
        message: "Instagram sync completed successfully",
        result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[ImportController] Instagram sync failed:", error);
      res.status(500).json({ error: "Failed to sync Instagram products" });
    }
  }

  /**
   * POST /api/import/whatsapp/sync
   * Sync products from WhatsApp Catalog (update existing + import new)
   */
  async syncWhatsAppProducts(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const connection = whatsappConnectionSchema.parse(req.body);
      const result = await importService.syncWhatsAppProducts(storeId, connection);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Sync completed with errors",
          result,
        });
      }

      res.json({
        success: true,
        message: "WhatsApp sync completed successfully",
        result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[ImportController] WhatsApp sync failed:", error);
      res.status(500).json({ error: "Failed to sync WhatsApp products" });
    }
  }

  /**
   * POST /api/import/instagram/validate
   * Validate Instagram connection
   */
  async validateInstagramConnection(req: Request, res: Response) {
    try {
      const connection = instagramConnectionSchema.parse(req.body);
      const isValid = await importService.validateInstagramConnection(connection);

      res.json({
        success: true,
        valid: isValid,
        message: isValid
          ? "Instagram connection is valid"
          : "Instagram connection is invalid",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[ImportController] Instagram validation failed:", error);
      res.status(500).json({ error: "Failed to validate Instagram connection" });
    }
  }

  /**
   * POST /api/import/whatsapp/validate
   * Validate WhatsApp connection
   */
  async validateWhatsAppConnection(req: Request, res: Response) {
    try {
      const connection = whatsappConnectionSchema.parse(req.body);
      const isValid = await importService.validateWhatsAppConnection(connection);

      res.json({
        success: true,
        valid: isValid,
        message: isValid
          ? "WhatsApp connection is valid"
          : "WhatsApp connection is invalid",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      console.error("[ImportController] WhatsApp validation failed:", error);
      res.status(500).json({ error: "Failed to validate WhatsApp connection" });
    }
  }

  /**
   * GET /api/import/history/:storeId
   * Get import history for a store
   */
  async getImportHistory(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const history = await importService.getImportHistory(storeId);

      if (!history) {
        return res.status(404).json({ error: "Store not found or no import history" });
      }

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error("[ImportController] Get history failed:", error);
      res.status(500).json({ error: "Failed to get import history" });
    }
  }

  /**
   * POST /api/import/schedule
   * Schedule automatic sync (placeholder for future implementation)
   */
  async scheduleAutoSync(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
      }

      const { source, intervalHours } = req.body;

      if (!source || !["instagram", "whatsapp_catalog"].includes(source)) {
        return res.status(400).json({
          error: "Invalid source. Must be 'instagram' or 'whatsapp_catalog'",
        });
      }

      if (!intervalHours || intervalHours < 1) {
        return res.status(400).json({
          error: "Invalid interval. Must be at least 1 hour",
        });
      }

      const scheduled = await importService.scheduleAutoSync(
        storeId,
        source,
        intervalHours
      );

      if (!scheduled) {
        return res.status(500).json({ error: "Failed to schedule auto-sync" });
      }

      res.json({
        success: true,
        message: `Auto-sync scheduled for ${source} every ${intervalHours} hours`,
      });
    } catch (error) {
      console.error("[ImportController] Schedule sync failed:", error);
      res.status(500).json({ error: "Failed to schedule auto-sync" });
    }
  }
}

// Export singleton instance
export const importController = new ImportController();