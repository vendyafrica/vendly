import { db } from "@vendly/db/db";
import { storeSettings, type StoreSettings, type NewStoreSettings } from "@vendly/db/schema";
import { eq } from "drizzle-orm";

export const settingsRepository = {
    async findByStoreId(storeId: string): Promise<StoreSettings | null> {
        const [settings] = await db
            .select()
            .from(storeSettings)
            .where(eq(storeSettings.storeId, storeId))
            .limit(1);
        return settings ?? null;
    },

    async create(data: NewStoreSettings): Promise<StoreSettings> {
        const [settings] = await db.insert(storeSettings).values(data).returning();
        return settings;
    },

    async update(storeId: string, data: Partial<NewStoreSettings>): Promise<StoreSettings | null> {
        const [updated] = await db
            .update(storeSettings)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(storeSettings.storeId, storeId))
            .returning();
        return updated ?? null;
    }
};

export type SettingsRepository = typeof settingsRepository;
