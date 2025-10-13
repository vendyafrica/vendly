import { createAuthClient } from "better-auth/client";
import { genericOAuthClient } from "better-auth/client/plugins";


export const authClient = createAuthClient({
  baseURL: process.env.EXPRESS_URL || "http://localhost:8000",
  basePath:"/api/auth",
  plugins: [genericOAuthClient()],
}) as ReturnType<typeof createAuthClient>;






