import { betterAuth } from "better-auth";
import { genericOAuth, magicLink, oneTap } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@vendly/db/db";
import * as schema from "@vendly/db/schema";
import { sendEmail, sendMagicLinkEmail } from "@vendly/transactional";
import { getInstagramToken, getInstagramUserInfo } from "./instagram";

const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
const secret = process.env.BETTER_AUTH_SECRET as string;

if (!baseURL) {
  throw new Error(
    "Missing BETTER_AUTH_URL (preferred) or NEXT_PUBLIC_APP_URL. This is required to generate correct OAuth redirect URLs."
  );
}

const isProd = process.env.NODE_ENV === "production";

function extractNameFromEmail(email: string): string {
  const emailPrefix = email.split("@")[0];
  return emailPrefix
    .split(/[._-]/)
    .map(
      (part: string) =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join(" ")
    .split(" ")[0];
}

const trustedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:8000",
  "https://vendly-web.vercel.app",
  "https://www.vendlyafrica.store",
  "https://vendlyafrica.store",
  "https://*.ngrok-free.dev",
  "https://harmonically-carpetless-janna.ngrok-free.dev",
  baseURL,
];

export const auth = betterAuth({
  baseURL,
  secret,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        verificationUrl: url,
        name: user.name,
      });
    },
    async afterEmailVerification(user, request) {
      console.log(`${user.email} has been successfully verified!`);
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!user.name || user.name === user.email) {
            const name = extractNameFromEmail(user.email);
            return {
              data: {
                ...user,
                name,
              },
            };
          }
        },
      },
    },
  },

  trustedOrigins,

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Explicitly set response mode to ensure response_type/code is requested correctly across environments
      responseMode: "query",
      redirectURI: `${baseURL}/api/auth/callback/google`,
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
          responseType: "code",
          responseMode: "query",
          scopes: [
            "instagram_business_basic",
            "instagram_business_manage_messages",
            "instagram_business_manage_comments",
            "instagram_business_content_publish",
          ],
          redirectURI: `${baseURL}/api/auth/callback/instagram`,
          getToken: getInstagramToken,
          getUserInfo: getInstagramUserInfo,
        },
      ],
    }),

    oneTap(),

    magicLink({
      async sendMagicLink({ email, url }) {
        await sendMagicLinkEmail({
          to: email,
          url,
        });
      },
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  advanced: {
    cookiePrefix: "vendly",
    cookies: {
      state: {
        attributes: {
          sameSite: isProd ? "none" : "lax",
          secure: isProd,
        },
      },
    },
    defaultCookieAttributes: {
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["instagram", "google"],
      allowDifferentEmails: true,
      updateUserInfoOnLink: false,
    },
  },
});

export type Auth = typeof auth;
