import "dotenv/config";

export const CONFIG = {
    NODE_ENV: process.env.NODE_ENV,
    BACKEND_URL: process.env.BACKEND_URL_PROD || process.env.BACKEND_URL_DEV,
    WEB_URL: process.env.WEB_URL_PROD || process.env.WEB_URL_DEV,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    DATABASE_URL: process.env.DATABASE_URL!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID,
    INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,
};