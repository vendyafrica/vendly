import { createAuthClient } from "better-auth/react";
import { genericOAuthClient, oneTapClient, magicLinkClient } from "better-auth/client/plugins";

const resolvedBaseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const authClient = createAuthClient({
  baseURL: resolvedBaseURL,
  basePath: "/api/auth",
  plugins: [
    genericOAuthClient(),
    magicLinkClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      autoSelect: true,
      cancelOnTapOutside: true,
      context: "signin",
      additionalOptions: {},
      promptOptions: {
        baseDelay: 500,
        maxAttempts: 5,
      },
    }),
  ],
});

export const signInWithGoogle = async (options?: { callbackURL?: string }) => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: options?.callbackURL,
  });
  return data;
};

export const signOut = async () => {
  const data = await authClient.signOut();
  return data;
};

export const signInWithOneTap = async () => {
  await authClient.oneTap();
};

export const signInWithMagicLink = async (email: string, options?: { callbackURL?: string }) => {
  const data = await authClient.signIn.magicLink({
    email,
    callbackURL: options?.callbackURL || "/",
  });
  return data;
}

export const signUp = async (email: string, password: string, name: string) => {
  const data = await authClient.signUp.email({
    email,
    password,
    name,
  });
  return data;
}

export const signInWithInstagram = async (options?: { callbackURL?: string }) => {
  const response = await authClient.signIn.oauth2({
    providerId: "instagram",
    callbackURL: options?.callbackURL || "/a/acme/integrations?connected=true",
  });
  return response;
}

export const linkInstagram = async (options?: { callbackURL?: string }) => {
  const response = await authClient.linkSocial({
    provider: "instagram",
    callbackURL: options?.callbackURL || "/a/acme/integrations?connected=true",
  });
  return response;
}

export const useSession = authClient.useSession;