import axios from "axios";
import { InstagramConfig } from './config';
import { TokenStore } from './token-store';
import { ShortLivedTokenResponse, LongLivedTokenResponse, InstagramProfile } from './types';

export class InstagramOAuthService {
  private config: InstagramConfig;
  private tokenStore: TokenStore;

  constructor(config: InstagramConfig, tokenStore: TokenStore) {
    this.config = config;
    this.tokenStore = tokenStore;
  }

  buildAuthorizationUrl(): string {
    const authUrl = new URL("https://www.instagram.com/oauth/authorize");

    authUrl.searchParams.set("client_id", this.config.clientId);
    authUrl.searchParams.set("redirect_uri", this.config.redirectUri);
    authUrl.searchParams.set("scope", this.config.getScopes().join(","));
    authUrl.searchParams.set("response_type", "code");

    if (process.env.INSTAGRAM_FORCE_REAUTH === "true") {
      authUrl.searchParams.set("force_reauth", "true");
    }

    const state = Math.random().toString(36).substring(7);
    authUrl.searchParams.set("state", state);

    console.log("✅ Authorization URL built successfully");
    return authUrl.toString();
  }

  async exchangeCodeForShortLivedToken(code: string): Promise<ShortLivedTokenResponse> {
    console.log("🔄 Exchanging authorization code for short-lived token...");

    const requestBody = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: "authorization_code",
      redirect_uri: this.config.redirectUri,
      code: code,
    });

    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      requestBody.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, user_id, permissions } = response.data;

    console.log("✅ Short-lived token obtained!");
    console.log("👤 User ID:", user_id);
    console.log("🔐 Permissions:", permissions || "Not provided");

    return {
      accessToken: access_token,
      userId: user_id,
      permissions: permissions || [],
    };
  }

  async exchangeForLongLivedToken(shortLivedToken: string): Promise<LongLivedTokenResponse> {
    console.log("🔄 Exchanging short-lived token for long-lived token...");

    const response = await axios.get(
      `${this.config.tokenApiBase}/access_token`,
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: this.config.clientSecret,
          access_token: shortLivedToken,
        },
      }
    );

    const { access_token, token_type, expires_in } = response.data;

    console.log("✅ Long-lived token obtained!");
    console.log("⏰ Expires in:", expires_in, "seconds");
    console.log("📅 That's approximately", Math.floor(expires_in / 86400), "days");

    return {
      accessToken: access_token,
      tokenType: token_type,
      expiresIn: expires_in,
    };
  }

  async fetchUserProfile(userId: string, accessToken: string): Promise<InstagramProfile> {
    console.log("🔄 Fetching Instagram profile for user:", userId);

    const fields = [
      "id", "username", "name", "account_type", "media_count",
      "followers_count", "follows_count", "profile_picture_url",
      "biography", "website",
    ].join(",");

    const response = await axios.get(
      `${this.config.graphApiBase}/${userId}`,
      {
        params: {
          fields: fields,
          access_token: accessToken,
        },
      }
    );

    console.log("✅ Profile data retrieved successfully");
    return response.data;
  }

  async refreshLongLivedToken(accessToken: string): Promise<LongLivedTokenResponse> {
    console.log("🔄 Refreshing long-lived token...");

    const response = await axios.get(
      `${this.config.tokenApiBase}/refresh_access_token`,
      {
        params: {
          grant_type: "ig_refresh_token",
          access_token: accessToken,
        },
      }
    );

    const { access_token, token_type, expires_in } = response.data;

    console.log("✅ Token refreshed successfully!");
    console.log("⏰ New expiry:", expires_in, "seconds");

    return {
      accessToken: access_token,
      tokenType: token_type,
      expiresIn: expires_in,
    };
  }

  formatError(error: any): any {
    const response: any = {
      success: false,
      error: error.message || "Unknown error occurred",
    };

    if (error.response?.data) {
      response.instagram_error = error.response.data;

      const errorMsg = error.response.data.error_message || "";

      if (errorMsg.includes("Invalid platform app")) {
        response.hint = "Instagram product not added to your Meta app. Go to Meta Dashboard → Add Products → Instagram";
      } else if (errorMsg.includes("Insufficient developer role")) {
        response.hint = "Add yourself as Developer/Tester in Meta Dashboard → Roles → Roles, then accept the invite in Instagram app";
      } else if (errorMsg.includes("redirect_uri")) {
        response.hint = `Redirect URI mismatch. Your .env has: ${this.config.redirectUri}. Ensure Meta Dashboard has the EXACT same value in Business Login settings.`;
      } else if (errorMsg.includes("Code has expired")) {
        response.hint = "Authorization code expired (they only last 60 seconds). Start the login flow again.";
      }
    }

    return response;
  }
}