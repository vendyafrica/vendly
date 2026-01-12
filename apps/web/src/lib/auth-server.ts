import { cookies } from "next/headers";

export async function authCookies() {
    const cookieStore = await cookies();
    return {
        headers: {
            cookie: cookieStore.toString(),
        },
    };
}
