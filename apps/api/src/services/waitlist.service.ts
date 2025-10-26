import { db, waitlist } from "@vendly/database";
import { WaitlistDto } from "@vendly/types";

export class WaitlistService {

  async joinWaitlist(data: WaitlistDto) {
    try {
      const result = await db.insert(waitlist).values({
        phone: data.phone,
        storeName: data.storeName,
        email: data.email,
      }).returning();

      return {
        message: "User joined waitlist successfully",
        data: result[0],
      };
    } catch (error) {
      console.error("Error joining waitlist:", error);
      throw new Error("Failed to join waitlist");
    }
  }
}

export const waitlistService = new WaitlistService();
