"use server";

import { db, eq, categories } from "@vendly/db";

export async function getCategoriesAction() {
  try {
    const allCategories = await db.select().from(categories).where(eq(categories.level, 0));
    return { success: true, data: allCategories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}
