import { Request, Response } from "express";
import { InstagramConfig, InstagramOAuthService } from "@vendly/instagram";

export const handleAuthInstagram = (config: InstagramConfig, instagramService: InstagramOAuthService) =>
  (_req: Request, res: Response) => {
    console.log("\n🚀 Instagram Login Flow Started");
    console.log("================================");

    const validation = config.validate();
    if (!validation.valid) {
      console.error("❌ Configuration Error:", validation.error);
      return res.status(500).json({
        success: false,
        error: validation.error,
        hint: "Check your .env file. You need INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET, and INSTAGRAM_REDIRECT_URI",
      });
    }

    console.log("✅ Configuration validated");
    console.log("📱 App ID:", config.clientId);
    console.log("🔗 Redirect URI:", config.redirectUri);
    console.log("🔐 Scopes:", config.getScopes().join(", "));

    const authUrl = instagramService.buildAuthorizationUrl();

    console.log("🔄 Redirecting user to Instagram...");
    console.log("🌐 Auth URL:", authUrl);
    console.log("================================\n");

    res.redirect(authUrl);
  };