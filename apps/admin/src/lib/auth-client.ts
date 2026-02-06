import { createAuthClient } from "better-auth/react";

const resolvedBaseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const authClient = createAuthClient({
    baseURL: resolvedBaseURL,
});
