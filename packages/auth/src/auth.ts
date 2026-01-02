import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@vendly/db/db";
import { sendEmail } from "@vendly/transactional";

const baseURL = process.env.BETTER_AUTH_URL || process.env.BACKEND_URL_PROD || "http://localhost:8000";

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET as string,

  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async afterEmailVerification(user, request) {
      console.log(`${user.email} has been successfully verified!`);
    },
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email",
        verificationUrl: url,
        name: user.name,
      });
    },
  },

  trustedOrigins: [
    process.env.WEB_URL_PROD || process.env.WEB_URL_DEV,
    process.env.STOREFRONT_URL_PROD || process.env.STOREFRONT_URL_DEV,
    "http://localhost:3000",
    "http://localhost:4000",
  ].filter((origin): origin is string => Boolean(origin)),

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
          redirectURI: `${baseURL}/api/auth/callback/instagram`,
          scopes: [
            "instagram_business_basic",
            "instagram_business_manage_messages",
            "instagram_business_manage_comments",
            "instagram_business_content_publish",
            "instagram_business_manage_insights"
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
    useSecureCookies: true,
    defaultCookieAttributes: {
     sameSite:"none",
     secure:true
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Auth = typeof auth;
