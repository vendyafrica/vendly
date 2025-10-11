import { createAuthClient } from "better-auth/client";
import { genericOAuthClient } from "better-auth/client/plugins";
// import type { RegisterRequest, LoginRequest } from "@vendly/types";

const API_URL = process.env.EXPRESS_URL || "http://localhost:8000";
const WEB_URL = process.env.WEB_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: process.env.EXPRESS_URL || "http://localhost:8000",
  basePath:"/api/v1/auth",
  plugins: [genericOAuthClient()],
}) as ReturnType<typeof createAuthClient>;

// export const signUpWithEmail = async (data: RegisterRequest) => {
//   try {
//     const response = await fetch(`${API_URL}/api/v1/auth/sign-up/email`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include", 
//       body: JSON.stringify({
//         email: data.email,
//         password: data.password,
//         name: data.name || data.email.split("@")[0],
//         image: data.image,
//         phoneNumber: data.phoneNumber,
//         role: data.role || "buyer",
//         whatsappEnabled: data.whatsappEnabled || false,
//       }),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error((error as { message?: string }).message || (error as { error?: string }).error || "Registration failed");
//     }

//     const result = await response.json();
//     return result;
//   } catch (error: any) {
//     console.error("Email sign-up failed:", error);
//     throw error;
//   }
// };


// export const signInWithEmail = async (data: LoginRequest) => {
//   try {
//     const result = await authClient.signIn.email({
//       email: data.email,
//       password: data.password,
//       callbackURL: WEB_URL,
//     });
//     return result;
//   } catch (error: any) {
//     console.error("Email sign-in failed:", error);
//     throw error;
//   }
// };


export const signInWithGoogle = async (): Promise<void> => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: WEB_URL,
    });
  } catch (error) {
    console.error("Google sign-in failed:", error);
    throw error;
  }
};

// Instagram (generic OAuth2) for seller account creation
export const signInWithInstagram = async (): Promise<void> => {
  try {
    await authClient.signIn.social({
      provider: "instagram",
      callbackURL: WEB_URL,
    });
  } catch (error) {
    console.error("Instagram sign-in failed:", error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await authClient.signOut();
  } catch (error) {
    console.error("Sign-out failed:", error);
    throw error;
  }
};

export const getSession = async (): Promise<any> => {
  try {
    const session = await authClient.getSession();
    console.log("Session:", session);
    return session;
  } catch (error) {
    console.error("Get session failed:", error);
    throw error;
  }
};
