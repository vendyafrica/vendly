import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import * as schema from "./schema/index";
import path from "path";

let _db: ReturnType<typeof drizzle> | undefined;

function getDatabaseUrl(): string {
  if (!process.env.DATABASE_URL) {
    config({ path: path.resolve(process.cwd(), ".env") });

    if (!process.env.DATABASE_URL) {
      config({ path: path.resolve(process.cwd(), "../../.env") });
    }
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  return databaseUrl;
}

function getDb(): ReturnType<typeof drizzle> {
  if (_db) return _db;
  _db = drizzle(getDatabaseUrl(), { schema });
  return _db;
}

export const db: ReturnType<typeof drizzle> = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb() as unknown as object, prop, receiver);
  },
  has(_target, prop) {
    return prop in (getDb() as unknown as object);
  },
  ownKeys() {
    return Reflect.ownKeys(getDb() as unknown as object);
  },
  getOwnPropertyDescriptor(_target, prop) {
    return Object.getOwnPropertyDescriptor(getDb() as unknown as object, prop);
  },
});
