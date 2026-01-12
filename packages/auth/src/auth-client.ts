import { createAuthClient } from "better-auth/react";
import { genericOAuthClient, oneTapClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000",
  // basePath: "/api/auth",
  plugins: [
    genericOAuthClient(),
    magicLinkClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      autoSelect: true,
      cancelOnTapOutside: true,
      context: "signin",
      additionalOptions: {},
      promptOptions: {
        baseDelay: 500,
        maxAttempts: 5,
      },
    }),
  ],
});