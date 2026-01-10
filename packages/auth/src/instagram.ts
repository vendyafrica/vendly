/**
 * Instagram OAuth Configuration
 * Separate configuration for Instagram authentication
 */

interface TokenExchangeParams {
    code: string;
    redirectURI: string;
}

interface TokenResponse {
    accessToken: string;
    refreshToken?: string;
    accessTokenExpiresAt?: Date;
    raw: any;
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    image: string | null;
    emailVerified: boolean;
}

/**
 * Exchange authorization code for access token
 */
export async function getInstagramToken({
    code,
    redirectURI,
}: TokenExchangeParams): Promise<TokenResponse> {
    console.log("[Instagram OAuth] Exchanging code for token...");

    const params = new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID as string,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET as string,
        grant_type: "authorization_code",
        redirect_uri: redirectURI,
        code,
    });

    // Exchange for short-lived token
    const response = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    const responseText = await response.text();
    console.log("[Instagram OAuth] Token exchange status:", response.status);

    const data = JSON.parse(responseText);

    if (data.error_type || data.error_message) {
        console.error("[Instagram OAuth] Token exchange error:", data);
        throw new Error(data.error_message || "Failed to exchange code for token");
    }

    // Exchange for long-lived token
    console.log("[Instagram OAuth] Exchanging for long-lived token...");

    const longLivedResponse = await fetch(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${data.access_token}`
    );

    const longLivedText = await longLivedResponse.text();
    const longLivedData = JSON.parse(longLivedText);

    if (longLivedData.error) {
        console.error("[Instagram OAuth] Long-lived token error:", longLivedData.error);
        // Fall back to short-lived token
        return {
            accessToken: data.access_token,
            refreshToken: undefined,
            accessTokenExpiresAt: undefined,
            raw: data,
        };
    }

    return {
        accessToken: longLivedData.access_token || data.access_token,
        refreshToken: undefined,
        accessTokenExpiresAt: longLivedData.expires_in
            ? new Date(Date.now() + longLivedData.expires_in * 1000)
            : undefined,
        raw: { ...data, ...longLivedData },
    };
}

/**
 * Get Instagram user information
 */
export async function getInstagramUserInfo(tokens: {
    accessToken: string;
    raw?: any;
}): Promise<UserProfile> {
    const accessToken = tokens.accessToken;

    if (!accessToken) {
        throw new Error("No access token provided");
    }

    console.log("[Instagram OAuth] Fetching user info...");

    const userId = tokens.raw?.user_id as string | undefined;

    // Fetch user profile from Instagram Business API
    const response = await fetch(
        `https://graph.instagram.com/v18.0/me?fields=id,username,account_type,profile_picture_url&access_token=${accessToken}`
    );

    const responseText = await response.text();
    console.log("[Instagram OAuth] User info status:", response.status);

    const data = JSON.parse(responseText);

    if (data.error) {
        console.error("[Instagram OAuth] User info error:", data.error);
        throw new Error(`Instagram API Error: ${data.error.message}`);
    }

    const finalId = data.id || userId;
    if (!finalId) {
        throw new Error("No Instagram user ID found");
    }

    return {
        id: finalId,
        name: data.username || `instagram_user_${finalId}`,
        email: `instagram_${finalId}@vendly.local`,
        image: data.profile_picture_url || null,
        emailVerified: true,
    };
}

/**
 * Instagram OAuth provider configuration
 */
export const instagramOAuthConfig = {
    providerId: "instagram",
    clientId: process.env.INSTAGRAM_CLIENT_ID as string,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string,
    authorizationUrl: "https://www.instagram.com/oauth/authorize",
    scopes: [
        "instagram_business_basic",
        "instagram_business_manage_messages",
        "instagram_business_manage_comments",
        "instagram_business_content_publish",
        "instagram_business_manage_insights",
    ],
    redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/instagram`,
    getToken: getInstagramToken,
    getUserInfo: getInstagramUserInfo,
};