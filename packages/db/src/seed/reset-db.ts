
import { db } from "../db";
import { sql } from "drizzle-orm";

async function reset() {
    console.log("⚠️  Resetting Database (Full Wipe)...");

    const tables = [
        "product_media",
        "product_images",
        "product_categories",
        "inventory_items",
        "product_variants",
        "products",
        "categories",
        "media_objects",
        "store_content",
        "store_themes",
        "store_memberships",
        "instagram_media",
        "stores",
        "tenant_memberships",
        "tenants",
        "account",
        "session",
        "verification",
        "chat_ownerships",
        "anonymous_chat_logs",
        "user",
        "platform_categories"
    ];

    for (const table of tables) {
        try {
            await db.execute(sql.raw(`DROP TABLE IF EXISTS "${table}" CASCADE`));
        } catch (e) {
            console.warn(`Warning dropping ${table}:`, (e as any).message);
        }
    }

    console.log("✅ Database tables dropped.");
    process.exit(0);
}

reset().catch((e) => {
    console.error(e);
    process.exit(1);
});
