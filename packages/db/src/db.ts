import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import postgres, { Sql } from "postgres";
import * as schema from "./schema/index";

// Lazy initialization to avoid errors when DATABASE_URL is not available at module load time
let _pgClient: Sql | null = null;
let _nodeDb: ReturnType<typeof drizzlePg<typeof schema>> | null = null;
let _neonClient: NeonQueryFunction<boolean, boolean> | null = null;
let _edgeDb: ReturnType<typeof drizzleNeon<typeof schema>> | null = null;

function getConnectionString(): string {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error(
            "DATABASE_URL environment variable is not set. " +
            "Please set it in your .env file or environment."
        );
    }
    return connectionString;
}

/**
 * Node.js database client - uses TCP connection (long-lasting)
 * Best for: Express.js, traditional Node.js servers
 */
export function getNodeDb() {
    if (!_nodeDb) {
        const connectionString = getConnectionString();
        _pgClient = postgres(connectionString);
        _nodeDb = drizzlePg(_pgClient, { schema });
    }
    return _nodeDb;
}

/**
 * Edge database client - uses HTTP connection
 * Best for: Vercel Edge Functions, Cloudflare Workers, Next.js middleware
 */
export function getEdgeDb() {
    if (!_edgeDb) {
        const connectionString = getConnectionString();
        _neonClient = neon(connectionString);
        _edgeDb = drizzleNeon(_neonClient, { schema });
    }
    return _edgeDb;
}

// For backwards compatibility - lazy getters
export const nodeDb = new Proxy({} as ReturnType<typeof drizzlePg<typeof schema>>, {
    get(_, prop) {
        return (getNodeDb() as Record<string | symbol, unknown>)[prop];
    },
});

export const edgeDb = new Proxy({} as ReturnType<typeof drizzleNeon<typeof schema>>, {
    get(_, prop) {
        return (getEdgeDb() as Record<string | symbol, unknown>)[prop];
    },
});

// Default export for backwards compatibility
export const db = nodeDb;