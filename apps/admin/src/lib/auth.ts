
import { authClient } from "@vendly/auth/client";

export async function signIn(email: string, password: string) {
    const data = await authClient.signIn.email({
        email,
        password,
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

export async function signInWithGoogle() {
    const data = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
    });
    return data;
}

export async function signOut() {
    const data = await authClient.signOut();
    return data;
}

export async function getSession() {
    const data = await authClient.getSession();
    return data;
}