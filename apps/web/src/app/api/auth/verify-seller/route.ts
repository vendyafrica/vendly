import { NextResponse } from "next/server";
import { db } from "@vendly/db/db";
import { users, verification, stores, tenantMemberships } from "@vendly/db/schema";
import { eq, and } from "@vendly/db";

/**
 * GET /api/auth/verify-seller?token=xxx&email=xxx
 *
 * Called when a new seller clicks the verification link in their email.
 * Validates the token, marks the user's email as verified, and redirects
 * to their store admin login page.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email")?.toLowerCase();

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/login?error=invalid-verification-link", req.url)
      );
    }

    // Look up the verification record
    const record = await db.query.verification.findFirst({
      where: and(
        eq(verification.identifier, email),
        eq(verification.value, token)
      ),
    });

    if (!record) {
      return NextResponse.redirect(
        new URL("/login?error=invalid-or-expired-link", req.url)
      );
    }

    if (new Date() > new Date(record.expiresAt)) {
      await db.delete(verification).where(eq(verification.id, record.id));
      return NextResponse.redirect(
        new URL("/login?error=link-expired", req.url)
      );
    }

    // Mark user email as verified
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: { id: true },
    });

    if (user) {
      await db
        .update(users)
        .set({ emailVerified: true })
        .where(eq(users.id, user.id));
    }

    // Clean up the verification token
    await db.delete(verification).where(eq(verification.id, record.id));

    // Find the user's store slug so we can redirect to their dashboard login
    let storeSlug: string | null = null;

    if (user) {
      const membership = await db.query.tenantMemberships.findFirst({
        where: eq(tenantMemberships.userId, user.id),
        columns: { tenantId: true },
      });

      if (membership) {
        const store = await db.query.stores.findFirst({
          where: eq(stores.tenantId, membership.tenantId),
          columns: { slug: true },
        });
        storeSlug = store?.slug ?? null;
      }
    }

    // Redirect to the store admin login with a verified flag
    if (storeSlug) {
      return NextResponse.redirect(
        new URL(`/a/${storeSlug}/login?verified=true`, req.url)
      );
    }

    // Fallback: redirect to generic login
    return NextResponse.redirect(
      new URL("/login?verified=true", req.url)
    );
  } catch (error) {
    console.error("Seller verification error:", error);
    return NextResponse.redirect(
      new URL("/login?error=verification-failed", req.url)
    );
  }
}
