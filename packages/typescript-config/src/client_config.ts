// Client-side config - only NEXT_PUBLIC_* variables
const isProd = process.env.NODE_ENV === "production";

export const CLIENT_CONFIG = {
  NODE_ENV: process.env.NODE_ENV,
  
  // API URL for client-side requests
  BACKEND_URL: isProd
    ? process.env.NEXT_PUBLIC_BACKEND_URL_PROD
    : process.env.NEXT_PUBLIC_BACKEND_URL_DEV,
    
  WEB_URL: isProd
    ? process.env.WEB_URL_PROD
    : process.env.WEB_URL_DEV,
    
  STOREFRONT_URL: isProd
    ? process.env.STOREFRONT_URL_PROD
    : process.env.STOREFRONT_URL_DEV,
};

// Runtime validation
if (!CLIENT_CONFIG.BACKEND_URL) {
  console.error('BACKEND_URL is not defined. Check your environment variables.');
}