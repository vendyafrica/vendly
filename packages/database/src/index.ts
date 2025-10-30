// packages/database/src/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from "dotenv";
import * as path from "path";
import * as schema from "./schema";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });

export { eq } from 'drizzle-orm';
export * from "./schema";
export * from "./queries";