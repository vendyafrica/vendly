import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema/index";

// 1. Setup the connection string once
const getUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing!");
  return url;
};

/**
 * FOR EXPRESS / BETTER AUTH (TCP)
 * Standard driver for long-running servers.
 */
export const nodeDb = drizzlePg(postgres(getUrl()), { schema });

/**
 * FOR NEXT.JS / EDGE (HTTP)
 * Fast, stateless driver for serverless.
 */
export const edgeDb = drizzleNeon(neon(getUrl()), { schema });

/**
 * DEFAULT EXPORT
 * Keep this as nodeDb so Better Auth stays happy by default.
 */
export const db = nodeDb;