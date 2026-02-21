import { NextResponse } from "next/server";
import { onboardingService } from "@/lib/c/onboarding-service";
import type { OnboardingData } from "@/lib/c/models";
import { sendWelcomeEmail } from "@vendly/transactional";
import { db } from "@vendly/db/db";
import { verification, users } from "@vendly/db/schema";
import { eq } from "@vendly/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, email, userId } = body as {
      data: OnboardingData;
      email?: string;
      userId?: string;
    };

    if (!data || !email || !userId) {
      return NextResponse.json({ error: "Missing onboarding data" }, { status: 400 });
    }

    const result = await onboardingService.createFullTenant(
      userId,
      email,
      data
    );

    const existing = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { emailVerified: true },
    });

    if (existing && !existing.emailVerified) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await db.delete(verification).where(eq(verification.identifier, email));

      await db.insert(verification).values({
        id: crypto.randomUUID(),
        identifier: email,
        value: token,
        expiresAt,
      });

      const webBaseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://duuka.store";
      const verifyBase = `${webBaseUrl}/api/auth/verify-seller?token=${token}&email=${encodeURIComponent(email)}`;
      const storeSlug = result.storeSlug;

      const dashboardUrl = `${verifyBase}&redirect=${encodeURIComponent(`/a/${storeSlug}`)}`;
      const connectInstagramUrl = `${verifyBase}&redirect=${encodeURIComponent(`/a/${storeSlug}/integrations`)}`;
      const storefrontUrl = `${webBaseUrl}/${storeSlug}`;

      await sendWelcomeEmail({
        to: email,
        name: data.personal?.fullName || "there",
        storefrontUrl,
        dashboardUrl,
        connectInstagramUrl,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}