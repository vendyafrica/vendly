import { any } from "better-auth/*";
import { createAuthClient } from "better-auth/client";
import { genericOAuthClient } from "better-auth/client/plugins";


export const authClient = createAuthClient({
  baseURL: process.env.EXPRESS_URL || "http://localhost:8000",
  basePath: "/api/auth",
  plugins: [genericOAuthClient()],
}) as ReturnType<typeof createAuthClient>;


export async function signInWithGoogle() {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: "https://www.vendlyafrica.store",
  });
  return data;
}

export async function signInWithInstagram() {
  try {
    const data = await authClient.signIn.oauth2({
      providerId: "instagram",
      callbackURL: "https://www.vendlyafrica.store",
      errorCallbackURL: "/auth/error",
    });
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



