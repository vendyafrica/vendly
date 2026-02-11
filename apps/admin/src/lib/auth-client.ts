import { createAuthClient } from "better-auth/react";
import { genericOAuthClient, oneTapClient, magicLinkClient } from "better-auth/client/plugins";

const resolvedBaseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "";

export const authClient = createAuthClient({
    baseURL: resolvedBaseURL,
    basePath: "/api/auth",
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
                fedCM: false,
            },
        }),
    ],
});
