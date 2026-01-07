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
    requireEmailVerification: true,
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
    process.env.NGROK_URL,
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
          scopes: [
            "instagram_business_basic",
            "instagram_business_manage_messages",
            "instagram_business_manage_comments",
            "instagram_business_content_publish",
            "instagram_business_manage_insights"
          ],
          redirectURI: `${baseURL}/api/auth/callback/instagram`,
          // Instagram requires form-urlencoded for token exchange
          getToken: async ({ code, redirectURI }: { code: string; redirectURI: string }) => {
            console.log("[Auth Debug] Exchanging code for token...");
            console.log("[Auth Debug] Redirect URI:", redirectURI);

            const params = new URLSearchParams({
              client_id: process.env.INSTAGRAM_CLIENT_ID as string,
              client_secret: process.env.INSTAGRAM_CLIENT_SECRET as string,
              grant_type: "authorization_code",
              redirect_uri: redirectURI,
              code,
            });

            console.log("[Auth Debug] Token exchange params (sanitized):", `client_id=..., code=..., redirect_uri=${redirectURI}`);

            const response = await fetch("https://api.instagram.com/oauth/access_token", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: params.toString(),
            });

            console.log("[Auth Debug] Token exchange response status:", response.status);
            const responseText = await response.text();
            console.log("[Auth Debug] Token exchange raw response:", responseText);

            const data = JSON.parse(responseText);

            if (data.error_type || data.error_message) {
              console.error("[Auth Debug] Token exchange error:", data);
              throw new Error(data.error_message || "Failed to exchange code for token");
            }

            // Instagram returns { access_token, user_id } for short-lived token
            // We need to exchange it for a long-lived token
            console.log("[Auth Debug] Short-lived token obtained, exchanging for long-lived...");

            const longLivedResponse = await fetch(
              `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${data.access_token}`
            );

            console.log("[Auth Debug] Long-lived token response status:", longLivedResponse.status);
            const longLivedText = await longLivedResponse.text();
            console.log("[Auth Debug] Long-lived token raw response:", longLivedText);

            const longLivedData = JSON.parse(longLivedText);

            if (longLivedData.error) {
              console.error("[Auth Debug] Long-lived token error:", longLivedData.error);
              // Fall back to short-lived token if long-lived fails
              return {
                accessToken: data.access_token,
                refreshToken: undefined,
                accessTokenExpiresAt: undefined,
                raw: data,
              };
            }

            return {
              accessToken: longLivedData.access_token || data.access_token,
              refreshToken: undefined,
              accessTokenExpiresAt: longLivedData.expires_in
                ? new Date(Date.now() + longLivedData.expires_in * 1000)
                : undefined,
              raw: { ...data, ...longLivedData },
            };
          },
          getUserInfo: async (tokens) => {
            const accessToken = tokens.accessToken;
            if (!accessToken) {
              console.error("[Auth Debug] No access token provided");
              throw new Error("No access token provided");
            }
            console.log("[Auth Debug] Fetching user info with token:", accessToken.substring(0, 20) + "...");
            console.log("[Auth Debug] Raw token data:", JSON.stringify(tokens.raw));

            // Use raw.user_id from token exchange if available
            const userId = tokens.raw?.user_id as string | undefined;

            // Instagram Business API only provides: id, username, account_type, profile_picture_url
            // Note: 'name' is NOT available in Instagram Business API
            const response = await fetch(
              `https://graph.instagram.com/v18.0/me?fields=id,username,account_type,profile_picture_url&access_token=${accessToken}`
            );

            console.log("[Auth Debug] Instagram API Response Status:", response.status);
            const responseText = await response.text();
            console.log("[Auth Debug] Instagram API Raw Response:", responseText);

            const data = JSON.parse(responseText);

            if (data.error) {
              console.error("[Auth Debug] Instagram API Error:", data.error);
              throw new Error(`Instagram API Error: ${data.error.message}`);
            }

            // Ensure we have a valid ID
            const finalId = data.id || userId;
            if (!finalId) {
              console.error("[Auth Debug] No user ID found in response or token data");
              throw new Error("No Instagram user ID found");
            }

            const userProfile = {
              id: finalId,
              name: data.username || `instagram_user_${finalId}`,
              email: `instagram_${finalId}@vendly.local`,
              image: data.profile_picture_url || null,
              emailVerified: true,
            };
            console.log("[Auth Debug] Constructed User Profile:", userProfile);
            return userProfile;
          },
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
      sameSite: "none",
      secure: true
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Auth = typeof auth;
