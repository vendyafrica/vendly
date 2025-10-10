import { Request, Response } from "express";
import { InstagramOAuthService, TokenStore } from "@vendly/instagram";

export const handleRefresh = (instagramService: InstagramOAuthService, tokenStore: TokenStore) =>
  async (req: Request, res: Response) => {
    console.log("\n🔄 Token Refresh Requested");
    console.log("================================");

    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: "missing_user_id",
        message: "user_id is required in request body",
      });
    }

    const tokenData = tokenStore.get(user_id);

    if (!tokenData) {
      return res.status(404).json({
        success: false,
        error: "token_not_found",
        message: "No token found for this user",
      });
    }

    try {
      console.log("🔄 Refreshing token for user:", user_id);

      const refreshedData = await instagramService.refreshLongLivedToken(
        tokenData.accessToken
      );

      tokenData.accessToken = refreshedData.accessToken;
      tokenData.tokenType = refreshedData.tokenType;
      tokenData.expiresIn = refreshedData.expiresIn;
      tokenData.obtainedAt = Date.now();

      tokenStore.save(user_id, tokenData);

      console.log("💾 Updated token stored");
      console.log("================================\n");

      return res.json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          access_token: refreshedData.accessToken,
          token_type: refreshedData.tokenType,
          expires_in: refreshedData.expiresIn,
          expires_at: new Date(Date.now() + refreshedData.expiresIn * 1000).toISOString(),
        },
      });

    } catch (error: any) {
      console.error("\n❌ Token Refresh Failed");
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