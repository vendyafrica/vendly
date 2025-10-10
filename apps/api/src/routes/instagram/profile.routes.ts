import { Request, Response } from "express";
import { InstagramOAuthService, TokenStore } from "@vendly/instagram";

export const handleGetProfile = (instagramService: InstagramOAuthService, tokenStore: TokenStore) =>
  async (req: Request, res: Response) => {
    console.log("\n👤 Fetching User Profile");
    console.log("================================");

    const userId = req.query.user_id as string || tokenStore.getAllUserIds()[0];

    if (!userId) {
      console.error("❌ No user_id provided and no tokens in store");
      return res.status(401).json({
        success: false,
        error: "not_authenticated",
        message: "No authenticated user found",
        hint: "Complete Instagram login first at /auth/instagram",
      });
    }

    const tokenData = tokenStore.get(userId);

    if (!tokenData) {
      console.error("❌ No token found for user:", userId);
      return res.status(401).json({
        success: false,
        error: "token_not_found",
        message: "No access token found for this user",
        hint: "User needs to complete Instagram login",
      });
    }

    if (tokenStore.isExpired(userId)) {
      console.error("❌ Token expired for user:", userId);
      return res.status(401).json({
        success: false,
        error: "token_expired",
        message: "Access token has expired",
        hint: "User needs to re-authenticate or refresh the token",
      });
    }

    try {
      console.log("✅ Token found and valid for user:", userId);

      const profile = await instagramService.fetchUserProfile(
        userId,
        tokenData.accessToken
      );

      console.log("================================\n");

      return res.json({
        success: true,
        profile: profile,
        token_info: {
          expires_in: tokenData.expiresIn,
          expires_at: new Date(tokenData.obtainedAt + tokenData.expiresIn * 1000).toISOString(),
          obtained_at: new Date(tokenData.obtainedAt).toISOString(),
        },
      });

    } catch (error: any) {
      console.error("\n❌ Profile Fetch Failed");
      console.error("================================");
      console.error("Error:", error.message);

      if (error.response?.data) {
        console.error("Instagram API Error:", JSON.stringify(error.response.data, null, 2));
      }

      console.error("================================\n");

      const errorResponse = instagramService.formatError(error);
      return res.status(error.response?.status || 500).json(errorResponse);
    }
  };