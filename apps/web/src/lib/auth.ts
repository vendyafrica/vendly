import { authClient } from "@vendly/auth/auth-client";

export async function signInWithGoogle() {
     const data = await authClient.signIn.social({
        provider: "google",
      });
      console.log("Signing in with Google...", data);
      return data;
  }
