import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/order-service";
import { createOrderSchema } from "@/lib/services/order-models";

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

        // Validate input
        const input = createOrderSchema.parse(body);

        // Create order
        const order = await orderService.createOrder(slug, input);

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);

        if (error instanceof Error) {
            if (error.message === "Store not found") {
                return NextResponse.json({ error: "Store not found" }, { status: 404 });
            }
            if (error.message.includes("not found")) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }

        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
