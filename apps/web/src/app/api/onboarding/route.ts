import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { onboardingService } from "@/app/c/lib/onboarding-service";
import type { OnboardingData } from "@/app/c/lib/models";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { data } = body as { data: OnboardingData };

        if (!data) {
            return NextResponse.json({ error: "Missing onboarding data" }, { status: 400 });
        }

        const result = await onboardingService.createFullTenant(
            session.user.id,
            session.user.email,
            data
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to complete onboarding" },
            { status: 500 }
        );
    }
}
