import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), "../../.env");
config({ path: envPath });

if (!process.env.DATABASE_URL) {
    config({ path: path.resolve(process.cwd(), ".env") });
}

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);

async function reset() {
    console.log("Dropping public schema...");
    try {
        await sql`DROP SCHEMA public CASCADE`;
    } catch (error) {
        console.error("Failed to reset database:", error);
        process.exit(1);
    }
}

reset();
