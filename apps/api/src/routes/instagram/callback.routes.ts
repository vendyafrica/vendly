import { Request, Response } from "express";
import { InstagramOAuthService, TokenStore, TokenData } from "@vendly/instagram";

export const handleCallback = (instagramService: InstagramOAuthService, tokenStore: TokenStore) =>
  async (req: Request, res: Response) => {
    console.log("\n📥 Instagram Callback Received");
    console.log("================================");

    const { code, error, error_reason, error_description } = req.query;

    if (error) {
      console.error("❌ OAuth Error:", { error, error_reason, error_description });
      return res.status(400).json({
        success: false,
        error: error as string,
        error_reason: error_reason as string,
        error_description: error_description as string,
        hint: "User may have denied permissions or an OAuth error occurred",
      });
    }

    if (!code || typeof code !== "string") {
      console.error("❌ No authorization code received");
      return res.status(400).json({
        success: false,
        error: "missing_code",
        message: "No authorization code received from Instagram",
      });
    }

    console.log("✅ Authorization code received");
    console.log("🔑 Code:", code.substring(0, 20) + "...");

    try {
      const shortLivedData = await instagramService.exchangeCodeForShortLivedToken(code);
      const longLivedData = await instagramService.exchangeForLongLivedToken(shortLivedData.accessToken);

      const tokenData: TokenData = {
        accessToken: longLivedData.accessToken,
        tokenType: longLivedData.tokenType,
        expiresIn: longLivedData.expiresIn,
        userId: shortLivedData.userId,
        permissions: shortLivedData.permissions,
        obtainedAt: Date.now(),
      };

      tokenStore.save(shortLivedData.userId, tokenData);

      console.log("================================\n");

      return res.json({
        success: true,
        message: "Instagram authentication successful! 🎉",
        data: {
          user_id: shortLivedData.userId,
          access_token: longLivedData.accessToken,
          token_type: longLivedData.tokenType,
          expires_in: longLivedData.expiresIn,
          expires_at: new Date(Date.now() + longLivedData.expiresIn * 1000).toISOString(),
          permissions: shortLivedData.permissions,
        },
        next_steps: {
          store_token: "Save this token in your database",
          refresh_token: "Set up automatic refresh before 60 days",
          use_token: "Use this token to make Instagram API calls",
        },
      });

    } catch (error: any) {
      console.error("\n❌ Token Exchange Failed");
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

export const handleExchange = (instagramService: InstagramOAuthService, tokenStore: TokenStore) =>
  async (req: Request, res: Response) => {
    console.log("\n📥 Instagram Code Exchange (frontend-initiated)");
    console.log("================================");

    const code = (req.body && req.body.code) || (req.query.code as string);

    if (!code || typeof code !== "string") {
      console.error("❌ No authorization code provided");
      return res.status(400).json({
        success: false,
        error: "missing_code",
        message: "Provide authorization code in request body { code: '...' }",
      });
    }

    console.log("✅ Authorization code received from frontend");
    console.log("🔑 Code:", code.substring(0, 20) + "...");

    try {
      const shortLivedData = await instagramService.exchangeCodeForShortLivedToken(code);
      const longLivedData = await instagramService.exchangeForLongLivedToken(shortLivedData.accessToken);

      const tokenData: TokenData = {
        accessToken: longLivedData.accessToken,
        tokenType: longLivedData.tokenType,
        expiresIn: longLivedData.expiresIn,
        userId: shortLivedData.userId,
        permissions: shortLivedData.permissions,
        obtainedAt: Date.now(),
      };

      tokenStore.save(shortLivedData.userId, tokenData);

      console.log("================================\n");

      return res.json({
        success: true,
        message: "Instagram authentication successful!",
        data: {
          user_id: shortLivedData.userId,
          access_token: longLivedData.accessToken,
          token_type: longLivedData.tokenType,
          expires_in: longLivedData.expiresIn,
          expires_at: new Date(Date.now() + longLivedData.expiresIn * 1000).toISOString(),
          permissions: shortLivedData.permissions,
        },
      });

    } catch (error: any) {
      console.error("\n❌ Code Exchange Failed");
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