import { createWaitlistEntry } from "@vendly/database";
import { Waitlist } from "@vendly/database/schema/waitlist";

export class WaitlistService {
  async joinWaitlist(data: Waitlist) {
    try {
      const result = await createWaitlistEntry(data);
      return {
        message: "User joined waitlist successfully",
        data: result,
      };
    } catch (error: any) {
      console.error("Detailed DB Error:", error);
      throw new Error("Failed to join waitlist");
    }
  }
}

export const waitlistService = new WaitlistService();