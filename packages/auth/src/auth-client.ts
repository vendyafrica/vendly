import { ClientOptions, createAuthClient } from "better-auth/client";
import { genericOAuthClient } from "better-auth/client/plugins";

type AuthClientOptions = Omit<ClientOptions, "plugins"> & {
  plugins: [ReturnType<typeof genericOAuthClient>];
};

// 1. Create the client locally so TypeScript can infer its full, augmented type
const _authClient: ReturnType<typeof createAuthClient<AuthClientOptions>> = createAuthClient<AuthClientOptions>({
  baseURL: (process.env.WEB_URL as string) || "http://localhost:3000",
  basePath: "/api/auth",
  plugins: [genericOAuthClient()],
});

// 2. Create an exported type from the inferred client
export type MyAuthClient = typeof _authClient;

// 3. Export the client with the new, explicit type
export const authClient: MyAuthClient = _authClient;

export async function signInWithGoogle() {
  const data = await authClient.signIn.social({
    provider: "google",
  });
  return data;
}

export async function signInWithInstagram() {
  try {
    const data = await authClient.signIn.oauth2({
      providerId: "instagram",
      callbackURL: "/dashboard",
      errorCallbackURL: "/auth/error",
    });

    console.log("Instagram sign-in successful:", data);
    return data;
  } catch (error) {
    console.error("Instagram sign-in failed:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    await authClient.signOut();
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  }
}