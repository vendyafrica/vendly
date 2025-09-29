// packages/database/src/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle({ client });

export { db };