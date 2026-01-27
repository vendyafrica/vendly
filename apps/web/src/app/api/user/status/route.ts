import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { onboardingRepository } from "@/lib/c/onboarding-repository";

export const GET = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return NextResponse.json({ hasTenant: false });
    }

    const hasTenant = await onboardingRepository.hasTenant(session.user.id);
    return NextResponse.json({ hasTenant });
};
