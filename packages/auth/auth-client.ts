import { createAuthClient } from "better-auth/client";


export const authClient = createAuthClient({
  baseURL: "http://localhost:8000",
});

export const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};