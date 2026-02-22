import { NextRequest, NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/models/order-models";

type RouteParams = {
    params: Promise<{ slug: string }>;
};

/**
 * POST /api/storefront/[slug]/orders
 * Create a new order from storefront checkout (public endpoint)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const body = await request.json();

        // Validate input early (reuse shared schema)
        const input = createOrderSchema.parse(body);

        const apiBase = process.env.NEXT_PUBLIC_API_URL;
        if (!apiBase) {
            return NextResponse.json(
                { error: "Missing NEXT_PUBLIC_API_URL; cannot reach Express API for notifications." },
                { status: 500 }
            );
        }

        console.log("[Web->API Proxy] Forwarding order create to Express API", { apiBase, slug });

        const res = await fetch(`${apiBase}/api/storefront/${slug}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            return NextResponse.json(json || { error: "Failed to create order" }, { status: res.status });
        }

        return NextResponse.json(json, { status: 201 });
    } catch (error) {
        console.error("Error proxying order create to Express API:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
