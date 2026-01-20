import { betterAuth } from "better-auth";
import { genericOAuth, magicLink, oneTap } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@vendly/db/db";
import * as schema from "@vendly/db/schema";
import { sendEmail, sendMagicLinkEmail } from "@vendly/transactional";
import { getInstagramToken, getInstagramUserInfo } from "./instagram";

const baseURL = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET as string;

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
  "https://harmonically-carpetless-janna.ngrok-free.dev",
  "https://vendly-web.vercel.app",
  "https://www.vendlyafrica.store",
  "https://vendlyafrica.store",
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
          sameSite: "none",
          secure: true,
        },
      },
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
});

export type Auth = typeof auth;
