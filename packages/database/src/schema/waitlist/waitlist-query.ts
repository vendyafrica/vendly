import { db, waitlist, eq } from "@/index";

type NewWaitlist = typeof waitlist.$inferInsert;

export async function createStoreWaitlist(data: NewWaitlist) {
  if (!data.storeName) {
    throw new Error("storeName is required");
  }

  const existing = await db
    .select()
    .from(waitlist)
    .where(eq(waitlist.storeName, data.storeName))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Store already exists in waitlist");
  }

  const [created] = await db
    .insert(waitlist)
    .values({ storeName: data.storeName })
    .returning();

  return created;
}