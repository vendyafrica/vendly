
import { authClient } from "@vendly/auth/auth-client";

export async function signInWithGoogle() {
	const data = await authClient.signIn.social({
		provider: "google",
		callbackURL:"/"
	});
	return data;
}


export async function SignOut() {
  const data = await authClient.signOut();
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

export async function signInWithInstagram() {
  const data = await authClient.signIn.social({
    provider: "instagram",
    callbackURL:  process.env.NEXT_PUBLIC_APP_URL + "/sell/business?connected=true"
  });
  return data;
}

export const useSession = authClient.useSession;
