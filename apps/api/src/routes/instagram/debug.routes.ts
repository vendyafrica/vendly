import { Request, Response } from "express";
import { InstagramConfig } from "@vendly/instagram";

export const handleDebug = (config: InstagramConfig) =>
  (_req: Request, res: Response) => {
    const validation = config.validate();

    const authUrl = new URL("https://www.instagram.com/oauth/authorize");
    if (config.clientId && config.redirectUri) {
      authUrl.searchParams.set("client_id", config.clientId);
      authUrl.searchParams.set("redirect_uri", config.redirectUri);
      authUrl.searchParams.set("scope", config.getScopes().join(","));
      authUrl.searchParams.set("response_type", "code");
      if (process.env.INSTAGRAM_FORCE_REAUTH === "true") {
        authUrl.searchParams.set("force_reauth", "true");
      }
    }

    return res.json({
      config_valid: validation.valid,
      issues: validation.valid ? [] : [validation.error],
      client_id_present: Boolean(config.clientId),
      client_id: config.clientId,
      redirect_uri_present: Boolean(config.redirectUri),
      redirect_uri: config.redirectUri,
      scopes: config.getScopes(),
      force_reauth: process.env.INSTAGRAM_FORCE_REAUTH === "true",
      authorize_url_example: config.clientId && config.redirectUri ? authUrl.toString() : null,
      notes: [
        "Copy the 'redirect_uri' value above",
        "Go to Meta Dashboard → Instagram → API Setup with Instagram Login → Business Login",
        "Paste it EXACTLY into 'Valid OAuth Redirect URIs' field",
        "The redirect URI must match EXACTLY (scheme, host, port, path, trailing slash)",
        "If app is in Development Mode, add your Instagram account under Roles → Testers",
        "Accept the tester invite in Instagram app: Settings → Apps and Websites → Tester Invites",
        "After changing dashboard settings, wait 1-2 minutes and restart your server",
      ],
    });
  };