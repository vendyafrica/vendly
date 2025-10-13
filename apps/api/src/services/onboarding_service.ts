import { authClient } from "@vendly/auth";
import { LoginResponse, RegisterRequest } from "@vendly/types";

export class OnboardingService {
    static API_URL = process.env.EXPRESS_URL || "http://localhost:8000";
    static WEB_URL = process.env.WEB_URL || "http://localhost:3000";

    public static signUpWithEmail = async (data: RegisterRequest): Promise<LoginResponse> => {
        try {
            const response = await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
                image: data.image,
                callbackURL: data.callbackURL,
            });
            if (response.error) {
                throw new Error(response.error.message);
            }
            return response.data as unknown as LoginResponse;
        } catch (error) {
            console.error("Email sign-up failed:", error);
            throw error;
        }
    };

    public static signInWithGoogle = async (): Promise<void> => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: OnboardingService.WEB_URL,
            });
        } catch (error) {
            console.error("Google sign-in failed:", error);
            throw error;
        }
    };

    public static signInWithInstagram = async (): Promise<void> => {
        try {
            await authClient.signIn.social({
                provider: "instagram",
                callbackURL: OnboardingService.WEB_URL,
            });
        } catch (error) {
            console.error("Instagram sign-in failed:", error);
            throw error;
        }
    };


    public static signOut = async (): Promise<void> => {
        try {
            await authClient.signOut();
        } catch (error) {
            console.error("Sign-out failed:", error);
            throw error;
        }
    };

    public static getSession = async (): Promise<any> => {
        try {
            const session = await authClient.getSession();
            console.log("Session:", session);
            return session;
        } catch (error) {
            console.error("Get session failed:", error);
            throw error;
        }
    };
};