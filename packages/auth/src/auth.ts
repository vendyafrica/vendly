/**
 * Better Auth Configuration
 * Main authentication setup with cleaner structure
 */
import { betterAuth } from "better-auth";
import { genericOAuth, magicLink, oneTap } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nodeDb } from "@vendly/db/db";
import * as schema from "@vendly/db/schema";
import { sendEmail, sendMagicLinkEmail } from "@vendly/transactional";
import { getInstagramToken, getInstagramUserInfo } from "./instagram";

const baseURL = process.env.BETTER_AUTH_URL as string;
const secret = process.env.BETTER_AUTH_SECRET as string;

/**
 * Extract user name from email
 */
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

/**
 * Trusted origins for CORS
 */
const trustedOrigins = [
  "http://localhost:3000",
  "http://localhost:8000",
  process.env.NGROK_URL,
].filter((origin): origin is string => Boolean(origin));

/**
 * Initialize Better Auth
 */
export const auth = betterAuth({
  baseURL,
  secret,

  // Database adapter
  database: drizzleAdapter(nodeDb, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  // Email & Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  // Email verification
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

  // Database hooks
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Auto-generate name from email if not provided
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

  // CORS configuration
  trustedOrigins,

  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Plugins
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "instagram",
          clientId: process.env.INSTAGRAM_CLIENT_ID as string,
          clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string,
          authorizationUrl: "https://www.instagram.com/oauth/authorize",
          scopes: [
            "instagram_business_basic",
            "instagram_business_manage_messages",
            "instagram_business_manage_comments",
            "instagram_business_content_publish",
            "instagram_business_manage_insights",
          ],
          redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/instagram`,
          getToken: getInstagramToken,
          getUserInfo: getInstagramUserInfo,
        },
      ],
    }),

    // Google One Tap
    oneTap(),

    // Magic Link authentication
    magicLink({
      async sendMagicLink({ email, url }) {
        await sendMagicLinkEmail({
          to: email,
          url,
        });
      },
    }),
  ],

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Refresh every 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
      refreshCache: true,
    },
  },

  // Advanced configuration
  advanced: {
    cookiePrefix: "vendly",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

export type Auth = typeof auth;
