// packages/auth/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/src/index";
import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google client ID and secret must be provided");
}

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});
