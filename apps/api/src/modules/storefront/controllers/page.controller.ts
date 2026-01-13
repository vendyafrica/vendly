import type { Request, Response, NextFunction } from "express";
import { pageService } from "../services/page.service";
import { z } from "zod";

const createPageSchema = z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    type: z.string().optional(),
    tenantId: z.string().uuid(), // Temporary, should be from context
});

const updateContentSchema = z.object({
    puckData: z.any(),
});

export class PageController {
    async getPages(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeId } = req.params;
            const pages = await pageService.getPages(storeId);
            return res.json({ success: true, data: pages });
        } catch (error) {
            next(error);
        }
    }

    async getPage(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeId, pageId } = req.params;
            // Note: route might user slug or ID. Assuming ID for now based on service structure needing ID for updates, 
            // but fetching by slug is common for storefronts.
            // Let's assume this endpoint is for the editor which usually works with IDs.
            // But wait, the service `getPage` takes (storeId, slug). 
            // If the route parameter is `pageId` (which is a UUID), we should use `findById` in repo.
            // For now let's support getting by slug if it looks like a slug, or ID otherwise? 
            // Or stick to one. Let's use ID for editor API.

            // Actually, `pageService.getPage` requests slug. Let's stick to slug for public fetch
            // and maybe add `getPageById` for editor if needed.

            // For now, let's implement get by slug for this specific controller method signature
            const page = await pageService.getPage(storeId, pageId); // pageId here treated as slug
            if (!page) return res.status(404).json({ error: "Page not found" });

            return res.json({ success: true, data: page });
        } catch (error) {
            next(error);
        }
    }

    async createPage(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeId } = req.params;
            const body = createPageSchema.parse(req.body);

            const page = await pageService.createPage({
                storeId,
                ...body,
            });

            return res.status(201).json({ success: true, data: page });
        } catch (error) {
            next(error);
        }
    }

    async updatePage(req: Request, res: Response, next: NextFunction) {
        try {
            const { pageId } = req.params;
            const body = updateContentSchema.parse(req.body);

            const updated = await pageService.updatePageContent(pageId, body.puckData);
            return res.json({ success: true, data: updated });
        } catch (error) {
            next(error);
        }
    }

    async publishPage(req: Request, res: Response, next: NextFunction) {
        try {
            const { pageId } = req.params;
            const published = await pageService.publishPage(pageId);
            return res.json({ success: true, data: published });
        } catch (error) {
            next(error);
        }
    }
}

export const pageController = new PageController();
