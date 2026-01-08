import { authClient } from "@vendly/auth/auth-client";

export async function signInWithGoogle() {
  try {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_APP_URL
    }, {
      onRequest: (ctx) => {
        console.log("Initiating Google sign-in...");
      },
      onSuccess: (ctx) => {
        console.log("Successfully signed in with Google:", ctx);
      },
      onError: (ctx) => {
        console.error("Google sign-in failed:", ctx.error.message);
        alert(ctx.error.message);
      }
    });
    return data;
  } catch (error) {
    console.error("Unexpected error during Google sign-in:", error);
    throw error;
  }
}


export async function SignOut() {
  const data = await authClient.signOut();
  console.log("Signing out...", data);
  return data;
}

export async function signInWithOneTap(): Promise<void> {
  await authClient.oneTap();
}

export async function signInWithMagicLink(email: string) {
  const data = await authClient.signIn.magicLink({
    email,
    callbackURL: process.env.NEXT_PUBLIC_APP_URL
  });
  return data;
}


export const useSession = authClient.useSession;

