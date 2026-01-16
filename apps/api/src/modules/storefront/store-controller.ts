import type { Request, Response, NextFunction } from "express";
import { storeService } from "../store-service";
import { z } from "zod";

const createStoreSchema = z.object({
    name: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    templateId: z.string().optional(),
});

export class StoreController {
    async createStore(req: Request, res: Response, next: NextFunction) {
        try {
            // In a real app, strict tenant validation from middleware
            const tenantId = req.body.tenantId; // Temporary for migration, should come from auth
            if (!tenantId) {
                return res.status(400).json({ error: "Tenant ID required" });
            }

            const body = createStoreSchema.parse(req.body);

            const store = await storeService.createStore({
                tenantId,
                ...body,
            });

            return res.status(201).json({ success: true, data: store });
        } catch (error) {
            next(error);
        }
    }

    async getStore(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeId } = req.params;
            const store = await storeService.getStoreById(storeId);

            if (!store) {
                return res.status(404).json({ error: "Store not found" });
            }

            return res.json({ success: true, data: store });
        } catch (error) {
            next(error);
        }
    }
}

export const storeController = new StoreController();
