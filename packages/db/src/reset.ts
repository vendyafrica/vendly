import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import path from "path";

// Load env vars from root
const envPath = path.resolve(process.cwd(), "../../.env");
config({ path: envPath });

// Fallback to local .env if root not found (though structure implies root)
if (!process.env.DATABASE_URL) {
    config({ path: path.resolve(process.cwd(), ".env") });
}

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);

async function reset() {
    console.log("warning: this will delete all data in the database.");
    console.log("💥 Dropping public schema...");

    try {
        // Drop the public schema and all its objects (tables, views, etc.)
        await sql`DROP SCHEMA public CASCADE`;
        // Recreate the public schema
        await sql`CREATE SCHEMA public`;
        // Restore default permissions
        await sql`GRANT ALL ON SCHEMA public TO public`;

        console.log("✅ Public schema recreated. Database is empty.");
    } catch (error) {
        console.error("❌ Failed to reset database:", error);
        process.exit(1);
    }
}

reset();
