// Server-side config - can access all env variables
const isProd = process.env.NODE_ENV === "production";

export const SERVER_CONFIG = {
  NODE_ENV: process.env.NODE_ENV,
  
  BACKEND_URL: isProd
    ? process.env.BACKEND_URL_PROD
    : process.env.BACKEND_URL_DEV,
    
  WEB_URL: isProd
    ? process.env.WEB_URL_PROD
    : process.env.WEB_URL_DEV,
    
  BETTER_AUTH_URL: isProd
    ? process.env.BETTER_AUTH_URL_PROD
    : process.env.BETTER_AUTH_URL_DEV,
    
  STOREFRONT_URL: isProd
    ? process.env.STOREFRONT_URL_PROD
    : process.env.STOREFRONT_URL_DEV,
    
  // Sensitive data - only accessible server-side
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,
};