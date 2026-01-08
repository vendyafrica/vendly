import { authClient } from "@vendly/auth/auth-client";

export async function signInWithGoogle() {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: "http://localhost:3000"
  });
  console.log("Signing in with Google...", data);
  return data;
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
    callbackURL: "http://localhost:3000",
  });
  return data;
}


export const useSession = authClient.useSession;

