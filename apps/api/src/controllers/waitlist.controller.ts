import { Request, Response } from "express";
import { WaitlistService, waitlistService } from "../services/waitlist.service";

export class WaitlistController {
  constructor(private waitlistService: WaitlistService) {}

  async joinWaitlist(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await this.waitlistService.joinWaitlist(data);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Controller error:", error);
      res.status(500).json({
        message: error.message || "Failed to join waitlist",
        error: true
      });
    }
  }
}

export const waitlistController = new WaitlistController(waitlistService);