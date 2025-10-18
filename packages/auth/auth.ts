import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, user, session, account, verification } from "../database/src/index";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:8000";

export const auth = betterAuth({
  baseURL,
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
    process.env.CLIENT_URL || "https://www.vendlyafrica.store",
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
          authorizationUrl: "https://www.instagram.com/oauth/authorize",
          tokenUrl: "https://api.instagram.com/oauth/access_token",
          userInfoUrl: "https://graph.instagram.com/me",
          scopes: [
            "instagram_business_basic",
            "instagram_business_content_publish",
            "instagram_business_manage_messages",
            "instagram_business_manage_comments",
          ],
        },
      ],
    }),
  ],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  advanced: {
    cookiePrefix: "vendly",
    // defaultCookieAttributes: {
    //   sameSite: "none",
    //   secure: true,
    //   partitioned: true
    // },
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Auth = typeof auth;
