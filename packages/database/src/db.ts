import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as path from "path";
import * as schema from "./schema";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not defined");
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });