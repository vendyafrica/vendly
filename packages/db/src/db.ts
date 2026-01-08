import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema/index";

const connectionString = process.env.DATABASE_URL!;

const pgClient = postgres(connectionString);
export const nodeDb = drizzlePg(pgClient, { schema });

const neonClient = neon(connectionString);
export const edgeDb = drizzleNeon(neonClient, { schema });

export const db = nodeDb;