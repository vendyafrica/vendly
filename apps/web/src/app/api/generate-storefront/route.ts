import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { storeSlug, colorTemplate = "dark" } = body;

        if (!storeSlug) {
            return NextResponse.json(
                { error: true, message: "storeSlug is required" },
                { status: 400 }
            );
        }

        // Call the API app's generate endpoint
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/storefront/${storeSlug}/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ colorTemplate }),
        });

        const result = await res.json();

        if (!res.ok) {
            return NextResponse.json(result, { status: res.status });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error generating storefront:", error);
        return NextResponse.json(
            {
                error: true,
                message: error instanceof Error ? error.message : "Generation failed"
            },
            { status: 500 }
        );
    }
}
