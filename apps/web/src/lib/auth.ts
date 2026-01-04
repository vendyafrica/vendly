import { authClient } from "@vendly/auth/auth-client";

export async function signInWithGoogle() {
     const data = await authClient.signIn.social({
        provider: "google",
       callbackURL: "http://localhost:3000/demo"
      });
      console.log("Signing in with Google...", data);
      return data;
  }

export async function SignOut() {
  const data = await authClient.signOut();
  console.log("Signing out...", data);
  return data;
}

export async function signInWithInstagram(){
  const data = await authClient.signIn.oauth2({
    providerId: "instagram",
    callbackURL: "http://localhost:3000/demo"
  })
  console.log("Signing in with Instagram...", data);
  return data;
}