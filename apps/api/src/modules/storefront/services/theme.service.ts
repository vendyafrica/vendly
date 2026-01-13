import { themeRepository, type ThemeRepository } from "../repositories/theme.repository";
import { type StoreTheme } from "@vendly/db/schema";

export class ThemeService {
    constructor(private themeRepo: ThemeRepository = themeRepository) { }

    async getTheme(storeId: string) {
        return this.themeRepo.findByStoreId(storeId);
    }

    async updateTheme(storeId: string, cssVariables: Record<string, string>, customCss?: string) {
        // Validate variables if needed
        return this.themeRepo.update(storeId, {
            cssVariables: cssVariables as StoreTheme['cssVariables'],
            customCss
        });
    }

    async getTemplates() {
        return this.themeRepo.getAllTemplates();
    }
}

export const themeService = new ThemeService();
