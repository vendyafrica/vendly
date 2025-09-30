import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000",
}) as ReturnType<typeof createAuthClient>;

export const signIn = async (): Promise<void> => {
  await authClient.signIn.social({
    provider: "google",
  });
};
