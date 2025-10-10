import { createAuthClient } from "better-auth/client";
import { genericOAuthClient } from "better-auth/client/plugins";

// Create a reusable auth client
export const authClient = createAuthClient({
  baseURL: process.env.EXPRESS_URL || "http://localhost:8000",
  plugins: [genericOAuthClient()],
}) as ReturnType<typeof createAuthClient>;

// --- Sign-in functions ---

// Google (social login)
export const signInWithGoogle = async (): Promise<void> => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/home",
    });
  } catch (error) {
    console.error("Google sign-in failed:", error);
  }
};

// Instagram (generic OAuth2)
export const signInWithInstagram = async (): Promise<void> => {
  try {
    await authClient.signIn.social({
      provider: "instagram",
      callbackURL: "/home",
    });
  } catch (error) {
    console.error("Instagram sign-in failed:", error);
  }
};

