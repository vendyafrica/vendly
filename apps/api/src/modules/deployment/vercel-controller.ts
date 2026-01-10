import { Request, Response } from "express";
import { vercelDeploymentService } from "./vercel-service";

export const vercelDeploymentController = {
  /**
   * List all tenants and their deployment status
   */
  async listTenants(_req: Request, res: Response): Promise<void> {
    try {
      const tenants = await vercelDeploymentService.listTenants();
      res.json({ tenants });
    } catch (error) {
      console.error("Error listing tenants:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to list tenants",
      });
    }
  },

  /**
   * Deploy a specific tenant (add subdomain to Vercel)
   */
  async deployTenant(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      if (!slug) {
        res.status(400).json({ error: "slug is required" });
        return;
      }

      const result = await vercelDeploymentService.deployTenant(slug);

      if (result.success) {
        res.json({
          success: true,
          slug,
          domain: result.domain,
        });
      } else {
        res.status(500).json({
          success: false,
          slug,
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Error deploying tenant:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to deploy tenant",
      });
    }
  },

  /**
   * Deploy all tenants
   */
  async deployAll(_req: Request, res: Response): Promise<void> {
    try {
      const result = await vercelDeploymentService.deployAllTenants();
      res.json(result);
    } catch (error) {
      console.error("Error deploying all tenants:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to deploy all tenants",
      });
    }
  },

  /**
   * Add subdomain to Vercel project
   */
  async addSubdomain(req: Request, res: Response): Promise<void> {
    try {
      const { subdomain } = req.body;

      if (!subdomain) {
        res.status(400).json({ error: "subdomain is required" });
        return;
      }

      const result =
        await vercelDeploymentService.addSubdomainToVercel(subdomain);

      if (result.success) {
        res.json({
          success: true,
          domain: result.domain,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Error adding subdomain:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to add subdomain",
      });
    }
  },
};
