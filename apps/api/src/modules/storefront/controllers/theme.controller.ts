import type { Request, Response, NextFunction } from "express";
import { themeService } from "../services/theme.service";
import { z } from "zod";

const updateThemeSchema = z.object({
    cssVariables: z.record(z.string()),
    customCss: z.string().optional(),
});

export class ThemeController {
    async getTheme(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeId } = req.params;
            const theme = await themeService.getTheme(storeId);

            if (!theme) return res.status(404).json({ error: "Theme not found" });

            return res.json({ success: true, data: theme });
        } catch (error) {
            next(error);
        }
    }

    async updateTheme(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeId } = req.params;
            const body = updateThemeSchema.parse(req.body);

            const updated = await themeService.updateTheme(storeId, body.cssVariables, body.customCss);
            return res.json({ success: true, data: updated });
        } catch (error) {
            next(error);
        }
    }

    async getTemplates(req: Request, res: Response, next: NextFunction) {
        try {
            const templates = await themeService.getTemplates();
            return res.json({ success: true, data: templates });
        } catch (error) {
            next(error);
        }
    }
}

export const themeController = new ThemeController();
