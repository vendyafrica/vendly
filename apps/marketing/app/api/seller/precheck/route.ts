import { NextResponse } from "next/server";
import { db } from "@vendly/db/db";
import { and, eq, isNull } from "@vendly/db";
import { stores, tenants, users } from "@vendly/db/schema";

function nameFromEmail(email: string) {
  const prefix = email.split("@")[0] ?? "";
  return prefix
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
    .split(" ")[0] || "Vendly Seller";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email?.trim();

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const tenant = await db.query.tenants.findFirst({
      where: and(eq(tenants.billingEmail, email), isNull(tenants.deletedAt)),
      columns: {
        id: true,
        slug: true,
      },
    });

    let adminStoreSlug: string | null = null;

    if (tenant) {
      const store = await db.query.stores.findFirst({
        where: and(eq(stores.tenantId, tenant.id), isNull(stores.deletedAt)),
        columns: { slug: true },
      });
      adminStoreSlug = store?.slug ?? null;

      return NextResponse.json({
        status: "exists",
        adminStoreSlug,
        tenantSlug: tenant.slug,
      });
    }

    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: { id: true, email: true },
    });

    if (!user) {
      const created = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          name: nameFromEmail(email),
          email,
          emailVerified: false,
        })
        .returning({ id: users.id, email: users.email });
      user = created[0];
    }

    return NextResponse.json({
      status: "ok",
      userId: user?.id,
      email: user?.email,
    });
  } catch (error) {
    console.error("Seller precheck failed", error);
    return NextResponse.json({ error: "Failed to check seller status" }, { status: 500 });
  }
}
