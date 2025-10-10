import { Request, Response } from "express";
import { TokenStore } from "@vendly/instagram";

export const handleStatus = (tokenStore: TokenStore) =>
  (req: Request, res: Response) => {
    const userId = req.query.user_id as string;

    if (!userId) {
      return res.json({
        authenticated: false,
        total_users: tokenStore.size,
        message: "Provide user_id query parameter to check specific user",
      });
    }

    const tokenData = tokenStore.get(userId);

    if (!tokenData) {
      return res.json({
        authenticated: false,
        user_id: userId,
        message: "No token found for this user",
      });
    }

    const tokenAge = Date.now() - tokenData.obtainedAt;
    const isExpired = tokenAge > tokenData.expiresIn * 1000;
    const remainingTime = tokenData.expiresIn * 1000 - tokenAge;

    return res.json({
      authenticated: !isExpired,
      user_id: userId,
      token_type: tokenData.tokenType,
      expires_at: new Date(tokenData.obtainedAt + tokenData.expiresIn * 1000).toISOString(),
      obtained_at: new Date(tokenData.obtainedAt).toISOString(),
      is_expired: isExpired,
      remaining_seconds: Math.max(0, Math.floor(remainingTime / 1000)),
      remaining_days: Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60 * 24))),
      permissions: tokenData.permissions,
    });
  };