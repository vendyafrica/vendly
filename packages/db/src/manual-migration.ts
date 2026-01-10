
import { db } from "./db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Running manual migration...");
    try {
        await db.execute(sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS phone_number text;`);
        console.log("Successfully added phone_number to tenants table.");
    } catch (e) {
        console.error("Error adding column:", e);
    }
    process.exit(0);
}

main();
