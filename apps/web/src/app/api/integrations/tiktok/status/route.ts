import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@vendly/db/db";
import { account } from "@vendly/db/schema";
import { and, eq } from "@vendly/db";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    const tiktokAccount = await db.query.account.findFirst({
      where: and(eq(account.userId, session.user.id), eq(account.providerId, "tiktok")),
      columns: {
        accessToken: true,
        scope: true,
      },
    });

    const scopes = tiktokAccount?.scope
      ? tiktokAccount.scope.split(",").map((scope) => scope.trim()).filter(Boolean)
      : [];

    return NextResponse.json({
      connected: Boolean(tiktokAccount?.accessToken),
      scopes,
    });
  } catch (error) {
    console.error("TikTok status check error:", error);
    return NextResponse.json({ connected: false, scopes: [] }, { status: 500 });
  }
}
