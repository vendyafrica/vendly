
import { authClient } from "@vendly/auth/auth-client";

export async function signInWithGoogle() {
	const data = await authClient.signIn.social({
		provider: "google",
		callbackURL:"http://localhost:3000"
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
    callbackURL: "http://localhost:3000"
  });
  return data;
}

export async function signUp(email: string, password: string, name: string) {
    const data = await authClient.signUp.email({
        email,
        password,
        name,
    });
    return data;
}

export async function signInWithInstagram() {
  const data = await authClient.signIn.social({
    provider: "instagram",
    callbackURL:  "http://localhost:3000/sell/business?connected=true"
  });
  return data;
}

export const useSession = authClient.useSession;
