import { db } from "@vendly/database";
import { waitlist } from "@vendly/database/schema";
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
    } catch (error: any) {
      console.error("🔥 Detailed DB Error:", error);
      throw new Error("Failed to join waitlist");
    }
  }
}

export const waitlistService = new WaitlistService();
