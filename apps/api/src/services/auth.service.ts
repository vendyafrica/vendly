import { auth } from "@vendly/auth";
import { fromNodeHeaders } from "better-auth/node";
import { Request } from "express";

export class AuthService {
  async getSession(req: Request) {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      return session;
    } catch (error) {
      console.error("AuthService Error:", error);
      throw new Error("Failed to get session");
    }
  }
}

export const authService = new AuthService();