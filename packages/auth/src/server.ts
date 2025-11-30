import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@vendly/database";


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
          getUserInfo: async ({ accessToken }) => {
            const response = await fetch(
              `https://graph.instagram.com/me?fields=id,username,account_type,profile_picture_url&access_token=${accessToken}`
            );

            if (!response.ok) {
              console.error("Instagram Profile Fetch Failed:", await response.text());
              return null;
            }

            const profile = await response.json();
            // FIX: Cast to 'any' to satisfy the TypeScript interface
            return profile as any;
          },

          // 2. MAPPER
          mapProfileToUser: async (profile: any) => {
            if (!profile || !profile.id) {
              throw new Error("Instagram login failed: No profile data received");
            }

            return {
              name: profile.username || "Instagram User",
              // Generates the required unique email
              email: `${profile.id}@instagram.void`,
              emailVerified: true,
              image: profile.profile_picture_url || "",
            };
          },
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
      sameSite: 'none', // Enable cross-site cookies
      secure: true, // Required for SameSite=None
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});



export type Auth = typeof auth;
