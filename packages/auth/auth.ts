import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, user, session, account, verification } from "../database/src/index";
import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:8000";

export const auth = betterAuth({
  baseURL: baseURL,
  secret: process.env.BETTER_AUTH_SECRET as string,
  
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  trustedOrigins: [
    process.env.WEB_URL || "http://localhost:3000",
    process.env.MARKETPLACE_URL || "http://localhost:4000",
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "instagram",
          clientId: process.env.INSTAGRAM_CLIENT_ID as string,
          clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string,
          authorizationUrl: "https://api.instagram.com/oauth/authorize",
          tokenUrl: "https://api.instagram.com/oauth/access_token",
          scopes: ["user_profile", "user_media"],
        },
      ],
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  advanced: {
    cookiePrefix: "vendly",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Auth = typeof auth;