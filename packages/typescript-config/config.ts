// packages/typescript-config/config.ts
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const isProd = process.env.NODE_ENV === "production";

export const BACKEND_URL = isProd
  ? process.env.BACKEND_URL_PROD
  : process.env.BACKEND_URL_DEV;

export const WEB_URL = isProd
  ? process.env.WEB_URL_PROD
  : process.env.WEB_URL_DEV;

export const BETTER_AUTH_URL = isProd
  ? process.env.BETTER_AUTH_URL_PROD
  : process.env.BETTER_AUTH_URL_DEV;

export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_URL,
  WEB_URL,
  BETTER_AUTH_URL,
};

console.log(`[ENV] Loaded ${isProd ? "production" : "development"} config`);
