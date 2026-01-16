
import { authClient } from "@vendly/auth/client";

export async function connectInstagram() {
    const response = await authClient.signIn.oauth2({
        providerId: "instagram",
        callbackURL: "/dashboard",
    });
    return response;
}