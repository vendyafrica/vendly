
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  getTableColumns,
  inArray,
  lt,
  type SQL,
} from "drizzle-orm";

import {
  user,
  account,
  chat_ownerships,
  anonymous_chat_logs,
} from "./schema/v0-clone";
import { generateHashedPassword } from "./utils";
import { db } from "./db";

export async function getUser(email: string): Promise<Array<{ id: string; name: string; email: string } & { password: string | null }>> {
  try {
    const users = await db
      .select({
        ...getTableColumns(user),
        password: account.password,
      })
      .from(user)
      .leftJoin(account, eq(user.id, account.userId))
      .where(eq(user.email, email));
    
    return users;
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(
  email: string,
  password: string
): Promise<User[]> {
  try {
    const hashedPassword = generateHashedPassword(password);
    const userId = crypto.randomUUID();
    
    // Create user first
    const [newUser] = await db
      .insert(user)
      .values({
        id: userId,
        name: email.split('@')[0], // Use part of email as name
        email,
      })
      .returning();
    
    // Then create account with password
    await db
      .insert(account)
      .values({
        id: crypto.randomUUID(),
        accountId: userId,
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
      });
    
    return [newUser];
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function createGuestUser(): Promise<User[]> {
  try {
    const guestId = crypto.randomUUID();
    const guestEmail = `guest-${guestId}@example.com`;

    return await db
      .insert(user)
      .values({
        id: guestId,
        name: 'Guest',
        email: guestEmail,
      })
      .returning();
  } catch (error) {
    console.error("Failed to create guest user in database");
    throw error;
  }
}

// Chat ownership functions
export async function createChatOwnership({
  v0ChatId,
  userId,
}: {
  v0ChatId: string;
  userId: string;
}) {
  try {
    return await db
      .insert(chat_ownerships)
      .values({
        v0_chat_id: v0ChatId,
        user_id: userId,
      })
      .onConflictDoNothing({ target: chat_ownerships.v0_chat_id });
  } catch (error) {
    console.error("Failed to create chat ownership in database");
    throw error;
  }
}

export async function getChatOwnership({ v0ChatId }: { v0ChatId: string }) {
  try {
    const [ownership] = await db
      .select()
      .from(chat_ownerships)
      .where(eq(chat_ownerships.v0_chat_id, v0ChatId));
    return ownership;
  } catch (error) {
    console.error("Failed to get chat ownership from database");
    throw error;
  }
}

export async function getChatIdsByUserId({
  userId,
}: {
  userId: string;
}): Promise<string[]> {
  try {
    const ownerships = await db
      .select({ v0ChatId: chat_ownerships.v0_chat_id })
      .from(chat_ownerships)
      .where(eq(chat_ownerships.user_id, userId))
      .orderBy(desc(chat_ownerships.created_at));

    return ownerships.map((o: { v0ChatId: string }) => o.v0ChatId);
  } catch (error) {
    console.error("Failed to get chat IDs by user from database");
    throw error;
  }
}

export async function deleteChatOwnership({ v0ChatId }: { v0ChatId: string }) {
  try {
    return await db
      .delete(chat_ownerships)
      .where(eq(chat_ownerships.v0_chat_id, v0ChatId));
  } catch (error) {
    console.error("Failed to delete chat ownership from database");
    throw error;
  }
}

// Rate limiting functions
export async function getChatCountByUserId({
  userId,
  differenceInHours,
}: {
  userId: string;
  differenceInHours: number;
}): Promise<number> {
  try {
    const hoursAgo = new Date(Date.now() - differenceInHours * 60 * 60 * 1000);

    const [stats] = await db
      .select({ count: count(chat_ownerships.id) })
      .from(chat_ownerships)
      .where(
        and(
          eq(chat_ownerships.user_id, userId),
          gte(chat_ownerships.created_at, hoursAgo)
        )
      );

    return stats?.count || 0;
  } catch (error) {
    console.error("Failed to get chat count by user from database");
    throw error;
  }
}

export async function getChatCountByIP({
  ipAddress,
  differenceInHours,
}: {
  ipAddress: string;
  differenceInHours: number;
}): Promise<number> {
  try {
    const hoursAgo = new Date(Date.now() - differenceInHours * 60 * 60 * 1000);

    const [stats] = await db
      .select({ count: count(anonymous_chat_logs.id) })
      .from(anonymous_chat_logs)
      .where(
        and(
          eq(anonymous_chat_logs.ip_address, ipAddress),
          gte(anonymous_chat_logs.created_at, hoursAgo)
        )
      );

    return stats?.count || 0;
  } catch (error) {
    console.error("Failed to get chat count by IP from database");
    throw error;
  }
}

export async function createAnonymousChatLog({
  ipAddress,
  v0ChatId,
}: {
  ipAddress: string;
  v0ChatId: string;
}) {
  try {
    return await db.insert(anonymous_chat_logs).values({
      ip_address: ipAddress,
      v0_chat_id: v0ChatId,
    });
  } catch (error) {
    console.error("Failed to create anonymous chat log in database");
    throw error;
  }
}
