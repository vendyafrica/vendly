import { storeRepository, type StoreRepository } from "../repositories/store.repository";
import { themeRepository, type ThemeRepository } from "../repositories/theme.repository";
import { pageRepository, type PageRepository } from "../repositories/page.repository";
import { settingsRepository, type SettingsRepository } from "../repositories/settings.repository";

const DEFAULT_CSS_VARIABLES = {
    "--color-background": "#ffffff",
    "--color-foreground": "#000000",
    "--color-primary": "#000000",
    "--color-primary-foreground": "#ffffff",
    "--color-secondary": "#f4f4f5",
    "--color-muted": "#71717a",
    "--color-accent": "#f4f4f5",
    "--color-border": "#e4e4e7",
    "--font-heading": "Inter",
    "--font-body": "Inter",
    "--font-size-base": "16px",
    "--radius": "0.5rem",
    "--container-width": "1280px",
};

export class StoreService {
    constructor(
        private storeRepo: StoreRepository = storeRepository,
        private themeRepo: ThemeRepository = themeRepository,
        private pageRepo: PageRepository = pageRepository,
        private settingsRepo: SettingsRepository = settingsRepository
    ) { }

    async createStore(input: {
        tenantId: string;
        name: string;
        slug: string;
        templateId?: string;
        cssVariables?: Record<string, string>;
    }) {
        // 1. Validate slug
        const existing = await this.storeRepo.findBySlug(input.slug);
        if (existing) {
            throw new Error(`Store with slug '${input.slug}' already exists`);
        }

        // 2. Create store
        const store = await this.storeRepo.create({
            tenantId: input.tenantId,
            name: input.name,
            slug: input.slug,
            status: "draft",
        });

        // 3. Initialize theme
        let cssVariables: Record<string, string> = DEFAULT_CSS_VARIABLES;
        let template = null;
        if (input.templateId) {
            // If templateId is 'default', we might have a seeded template or just use hardcoded defaults
            // Try to fetch it:
            template = await this.themeRepo.findTemplateBySlug(input.templateId);

            if (template) {
                // Ensure template variables are merged/used
                cssVariables = { ...DEFAULT_CSS_VARIABLES, ...template.defaultCssVariables };
            } else if (input.templateId !== "default") {
                // If specific template requested but not found, maybe log warning?
                // For now, proceed with defaults.
            }
        }

        // Merge user-provided variables (e.g. from onboarding customization)
        if (input.cssVariables) {
            cssVariables = { ...cssVariables, ...input.cssVariables };
        }

        await this.themeRepo.create({
            tenantId: input.tenantId,
            storeId: store.id,
            templateId: template?.id,
            cssVariables: cssVariables as any, // Cast to satisfy schema strictly
        });

        // 4. Initialize default pages (Home, Product, etc.)
        // This would typically come from the template's defaultPages
        // For now, we create a basic home page
        await this.pageRepo.create({
            tenantId: input.tenantId,
            storeId: store.id,
            title: "Home",
            slug: "home",
            type: "home",
            isSystem: true,
            isPublished: false,
            puckData: template?.defaultPages?.home || { content: [], root: { props: {} }, zones: {} },
        });

        // 5. Initialize settings
        await this.settingsRepo.create({
            tenantId: input.tenantId,
            storeId: store.id,
        });

        return store;
    }

    async getStoreBySlug(slug: string) {
        return this.storeRepo.findBySlug(slug);
    }

    async getStoreById(id: string) {
        return this.storeRepo.findById(id);
    }
}

export const storeService = new StoreService();
