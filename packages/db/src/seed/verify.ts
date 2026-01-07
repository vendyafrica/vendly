
import { db } from "../db";
import { count } from "drizzle-orm";
import { tenants, users } from "../schema/core-schema";
import { stores, storeThemes, storeContent } from "../schema/storefront-schema";
import { categories } from "../schema/category-schema"; // Store categories
import { platformCategories } from "../schema/core-schema";

async function verify() {
    console.log("🔍 Verifying Database State...");

    const [tCount] = await db.select({ count: count() }).from(tenants);
    const [uCount] = await db.select({ count: count() }).from(users);
    const [sCount] = await db.select({ count: count() }).from(stores);
    const [themeCount] = await db.select({ count: count() }).from(storeThemes);
    const [contentCount] = await db.select({ count: count() }).from(storeContent);
    const [catCount] = await db.select({ count: count() }).from(categories);
    const [pcCount] = await db.select({ count: count() }).from(platformCategories);

    console.log({
        Tenants: tCount.count,
        Users: uCount.count,
        Stores: sCount.count,
        Themes: themeCount.count,
        Content: contentCount.count,
        StoreCategories: catCount.count,
        PlatformCategories: pcCount.count
    });

    process.exit(0);
}

verify().catch(console.error);
