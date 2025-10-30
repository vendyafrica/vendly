import { db } from "../index";
import { waitlist } from "../schema";
import { eq } from "drizzle-orm";
import { WaitlistDto } from "@vendly/types";

export async function createWaitlistEntry(data: WaitlistDto) {
  const result = await db
    .insert(waitlist)
    .values({
      phone: data.phone,
      storeName: data.storeName,
      email: data.email,
    })
    .returning();
  return result[0];
}

export async function getWaitlistByEmail(email: string) {
  const result = await db
    .select()
    .from(waitlist)
    .where(eq(waitlist.email, email))
    .limit(1);
  return result[0];
}

export async function getAllWaitlist() {
  return await db.select().from(waitlist);
}

export async function deleteWaitlistEntry(id: number) {
  await db.delete(waitlist).where(eq(waitlist.id, id));
}