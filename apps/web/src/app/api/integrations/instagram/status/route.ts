import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@vendly/db/db";
import { account } from "@vendly/db/schema";
import { eq, and } from "@vendly/db";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    // Check better-auth account link
    const instagramAuthAccount = await db.query.account.findFirst({
      where: and(
        eq(account.userId, session.user.id),
        eq(account.providerId, "instagram"),
      ),
    });

    // Check internal instagram account link (optional, but good for consistency)
    // We can rely on auth account to determine "connected" status for OAuth purposes
    const isConnected = !!instagramAuthAccount?.accessToken;

    return NextResponse.json({ connected: isConnected });
  } catch (error) {
    console.error("Instagram status check error:", error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}
