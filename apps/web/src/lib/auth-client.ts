import { authClient } from "@vendly/auth/client";

export const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: "http://localhost:3000"
  });
};

export const signUpWithEmail = async (email: string, password: string, name?: string) => {
  const data = await authClient.signUp.email({
    email,
    password,
    name: name || "",
  });
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const data = await authClient.signIn.email({
    email,
    password,
  });
  return data;
};

export const signOut = async () => {
  const data = await authClient.signOut();
  return data;
};

export const requestPasswordReset = async (email: string) => {
  const data = await authClient.requestPasswordReset({
    email,
  });
  return data;
};

export const resetPassword = async (newPassword: string, token: string) => {
  const data = await authClient.resetPassword({
    newPassword,
    token,
  });
  return data;
};

export const changePassword = async (newPassword: string, currentPassword: string) => {
  const data = await authClient.changePassword({
    newPassword,
    currentPassword,
  });
  return data;
};

export const signInWithInstagram = async () => {
  const data = await authClient.signIn.oauth2({
    providerId: "instagram",
    callbackURL: "/",
  })
};

export const getSession = async () => {
  const data = await authClient.getSession();
  return data;
};