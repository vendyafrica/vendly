import { Request, Response } from "express";
import { authService, AuthService } from "../services/auth_service";

class AuthController {
  constructor(private authService: AuthService) {}

  async getSession(req: Request, res: Response) {
    try {
      const session = await this.authService.getSession(req);
      return res.json(session);
    } catch (error) {
      console.error("Error getting session:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}


export const authController = new AuthController(authService);