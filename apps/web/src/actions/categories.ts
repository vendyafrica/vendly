"use server";

import { db } from "@vendly/db";
import { categories } from "@vendly/db/schema";
import { eq } from "drizzle-orm";

export async function getCategoriesAction() {
    try {
        const allCategories = await db.select().from(categories).where(eq(categories.level, 0));
        return { success: true, data: allCategories };
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return { success: false, error: "Failed to fetch categories" };
    }
}
