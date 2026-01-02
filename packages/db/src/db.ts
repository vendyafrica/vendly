import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { fileURLToPath } from "url";

if (!process.env.DATABASE_URL) {
  config({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = drizzle(databaseUrl);
