import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import * as schema from "./schema/index";
import path from "path";

if (!process.env.DATABASE_URL) {
  // Try to load from project root (useful when running scripts)
  config({ path: path.resolve(process.cwd(), ".env") });
  
  // Try traversing up if not found (useful for monorepo packages)
  if (!process.env.DATABASE_URL) {
    config({ path: path.resolve(process.cwd(), "../../.env") });
  }
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = drizzle(databaseUrl, { schema });
