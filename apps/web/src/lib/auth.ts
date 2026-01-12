
import { authClient } from "@vendly/auth/auth-client";

export async function signInWithGoogle() {
	try {
		console.log("Environment URL:", process.env.NEXT_PUBLIC_APP_URL);

		const data = await authClient.signIn.social({
			provider: "google",
			callbackURL: "/"
		}, {
			onRequest: (ctx) => {
				console.log("OAuth request initiated:", ctx);
			},
			onSuccess: (ctx) => {
				console.log("OAuth success:", ctx);
			},
			onError: (ctx) => {
				console.error("OAuth error details:", {
					message: ctx.error.message,
					status: ctx.error.status,
					cause: ctx.error.cause
				});
			}
		});
		return data;
	} catch (error) {
		console.error("Caught error:", error);
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

export async function signInWithInstagram() {
  const data = await authClient.signIn.social({
    provider: "instagram",
    callbackURL:  process.env.NEXT_PUBLIC_APP_URL + "/sell/business?connected=true"
  });
  return data;
}

export const useSession = authClient.useSession;
