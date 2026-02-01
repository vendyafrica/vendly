import { neon, Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleWs } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import ws from "ws";

// Set up WebSocket constructor for non-edge environments (like development)
if (typeof (globalThis as any).window === "undefined") {
    neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL!;

// HTTP client for simple queries
const clientHttp = neon(connectionString);
export const db = drizzleHttp(clientHttp, { schema });

// Pool/WebSocket client for transactions
const clientWs = new Pool({ connectionString });
export const dbWs = drizzleWs(clientWs, { schema });

export const neonClient = clientHttp;