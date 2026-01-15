import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import path from "path";

// Load env vars from root
const envPath = path.resolve(process.cwd(), "../../.env");
config({ path: envPath });

// Fallback to local .env if root not found
if (!process.env.DATABASE_URL) {
    config({ path: path.resolve(process.cwd(), ".env") });
}

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);

/**
 * Migration: Add Sanity integration fields
 * - Adds onboarding fields to tenants table
 * - Adds Sanity integration fields to stores table
 */
async function migrate() {
    console.log("🔄 Running migration: Add Sanity integration fields...\n");

    try {
        // 1. Add onboarding fields to tenants
        console.log("1️⃣  Adding onboarding fields to tenants table...");
        await sql`
            ALTER TABLE tenants
            ADD COLUMN IF NOT EXISTS owner_name TEXT,
            ADD COLUMN IF NOT EXISTS owner_phone TEXT,
            ADD COLUMN IF NOT EXISTS business_type TEXT[],
            ADD COLUMN IF NOT EXISTS categories TEXT[],
            ADD COLUMN IF NOT EXISTS location TEXT
        `;
        console.log("✅ Onboarding fields added to tenants\n");

        // 2. Add Sanity fields to stores
        console.log("2️⃣  Adding Sanity integration fields to stores table...");
        await sql`
            ALTER TABLE stores
            ADD COLUMN IF NOT EXISTS sanity_store_id TEXT NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS sanity_design_system TEXT DEFAULT 'design-system-modern'
        `;
        console.log("✅ Sanity fields added to stores\n");

        // 3. Create index on sanity_store_id
        console.log("3️⃣  Creating index on stores.sanity_store_id...");
        await sql`
            CREATE INDEX IF NOT EXISTS stores_sanity_idx ON stores(sanity_store_id)
        `;
        console.log("✅ Index created\n");

        // 4. Migrate existing data
        console.log("4️⃣  Migrating existing store data...");
        await sql`
            UPDATE stores
            SET sanity_store_id = slug
            WHERE sanity_store_id = '' OR sanity_store_id IS NULL
        `;
        console.log("✅ Existing stores migrated\n");

        console.log("🎉 Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

migrate();
