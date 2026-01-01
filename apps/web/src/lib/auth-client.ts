import { createAuthClient } from "better-auth/client";
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  basePath: "/api/auth",
  plugins: [genericOAuthClient()],
});

export type MyAuthClient = typeof authClient;
