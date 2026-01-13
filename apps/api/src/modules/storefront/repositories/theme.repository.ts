import { db } from "@vendly/db/db";
import { storeThemes, templates, type StoreTheme, type NewStoreTheme, type Template } from "@vendly/db/schema";
import { eq } from "drizzle-orm";

export const themeRepository = {
    async findByStoreId(storeId: string): Promise<StoreTheme | null> {
        const [theme] = await db
            .select()
            .from(storeThemes)
            .where(eq(storeThemes.storeId, storeId))
            .limit(1);
        return theme ?? null;
    },

    async create(data: NewStoreTheme): Promise<StoreTheme> {
        const [theme] = await db.insert(storeThemes).values(data).returning();
        return theme;
    },

    async update(storeId: string, data: Partial<NewStoreTheme>): Promise<StoreTheme | null> {
        const [updated] = await db
            .update(storeThemes)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(storeThemes.storeId, storeId))
            .returning();
        return updated ?? null;
    },

    async findTemplateBySlug(slug: string): Promise<Template | null> {
        const [template] = await db
            .select()
            .from(templates)
            .where(eq(templates.slug, slug))
            .limit(1);
        return template ?? null;
    },

    async getAllTemplates(): Promise<Template[]> {
        return db.select().from(templates).where(eq(templates.isActive, true));
    }
};

export type ThemeRepository = typeof themeRepository;
