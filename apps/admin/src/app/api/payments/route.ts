import { db } from "@vendly/db/db";
import { payments, orders, stores } from "@vendly/db/schema";
import { eq, desc } from "@vendly/db";
import { NextResponse } from "next/server";
import { checkPlatformRoleApi } from "@/lib/auth-guard";

export async function GET() {
    const auth = await checkPlatformRoleApi(["super_admin"]);
    if (auth.error) {
        return NextResponse.json(auth, { status: auth.status });
    }

    try {
        const data = await db
            .select({
                id: payments.id,
                provider: payments.provider,
                providerReference: payments.providerReference,
                status: payments.status,
                amount: payments.amount,
                currency: payments.currency,
                createdAt: payments.createdAt,
                orderNumber: orders.orderNumber,
                storeName: stores.name,
            })
            .from(payments)
            .leftJoin(orders, eq(payments.orderId, orders.id))
            .leftJoin(stores, eq(payments.storeId, stores.id))
            .orderBy(desc(payments.createdAt))
            .limit(100);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Payments API Error:", error);
        return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
    }
}
