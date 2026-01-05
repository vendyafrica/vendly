import { authClient } from "@vendly/auth/auth-client";

export async function signInWithGoogle() {
     const data = await authClient.signIn.social({
        provider: "google",
       callbackURL: "http://localhost:5000"
      });
      console.log("Signing in with Google...", data);
      return data;
  }

export async function SignOut() {
  const data = await authClient.signOut();
  console.log("Signing out...", data);
  return data;
}