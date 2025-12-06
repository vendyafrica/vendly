import { ClientOptions, createAuthClient } from "better-auth/client";
import { genericOAuthClient } from "better-auth/client/plugins";

type AuthClientOptions = Omit<ClientOptions, "plugins"> & {
  plugins: [ReturnType<typeof genericOAuthClient>];
};

const _authClient: ReturnType<typeof createAuthClient<AuthClientOptions>> = createAuthClient<AuthClientOptions>({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  basePath: "/api/auth",
  plugins: [genericOAuthClient()],
});

export type MyAuthClient = typeof _authClient;

export const authClient: MyAuthClient = _authClient;
