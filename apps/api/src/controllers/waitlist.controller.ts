import { Request, Response } from "express";
import { WaitlistService, waitlistService } from "../services/waitlist.service";

export class WaitlistController {
  constructor(private waitlistService: WaitlistService) {}

  async joinWaitlist(req: Request, res: Response) {
    const data = req.body;
    const result = await this.waitlistService.joinWaitlist(data);
    res.status(200).json(result);
  }
}

export const waitlistController = new WaitlistController(waitlistService);
