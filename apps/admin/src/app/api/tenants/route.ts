import { db } from "@vendly/db/db";
import { tenants } from "@vendly/db/schema";
import { desc } from "@vendly/db";
import { NextResponse } from "next/server";
import { checkSuperAdminApi } from "@/lib/auth-guard";

export async function GET() {
    const auth = await checkSuperAdminApi(["super_admin"]);
    if (auth.error) {
        return NextResponse.json(auth, { status: auth.status });
    }

    try {
        const data = await db.query.tenants.findMany({
            orderBy: [desc(tenants.createdAt)],
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Tenants API Error:", error);
        return NextResponse.json({ error: "Failed to fetch tenants" }, { status: 500 });
    }
}
