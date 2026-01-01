import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Support both DATABASE_URL (Neon) and POSTGRES_URL (PostgreSQL)
const neonUrl = process.env.DATABASE_URL;
const postgresUrl = process.env.POSTGRES_URL;

if (!neonUrl && !postgresUrl) {
  throw new Error("Neither DATABASE_URL nor POSTGRES_URL environment variable is set");
}

export const db = neonUrl 
  ? drizzle(neonUrl)
  : drizzlePostgres(postgresUrl!, { schema: {} });
