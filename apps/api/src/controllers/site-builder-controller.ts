import { Request, Response } from "express";
import { siteBuilderService } from "../services/site-builder-service";

const ROOT_DOMAIN = process.env.ROOT_DOMAIN ?? "vendlyafrica.store";

export class SiteBuilderController {
  async start(req: Request, res: Response): Promise<void> {
    const { tenantSlug, input } = req.body ?? {};

    if (!tenantSlug || typeof tenantSlug !== "string") {
      res.status(400).json({ error: "tenantSlug is required" });
      return;
    }

    const job = siteBuilderService.startJob({ tenantSlug, input });

    res.json({
      jobId: job.id,
      tenantSlug: job.tenantSlug,
    });
  }

  async status(req: Request, res: Response): Promise<void> {
    const jobId = req.query.jobId;

    if (!jobId || typeof jobId !== "string") {
      res.status(400).json({ error: "jobId is required" });
      return;
    }

    const job = siteBuilderService.getJob(jobId);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    const readyUrl = `https://${job.tenantSlug}.${ROOT_DOMAIN}`;

    res.json({
      jobId: job.id,
      tenantSlug: job.tenantSlug,
      status: job.status,
      readyUrl: job.status === "ready" ? readyUrl : undefined,
      error: job.error,
    });
  }
}

export const siteBuilderController = new SiteBuilderController();
