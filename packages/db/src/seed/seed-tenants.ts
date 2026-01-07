import { db } from "../db";
import { tenants, users, tenantMemberships } from "../schema/core-schema";
import { eq } from "drizzle-orm";

const SEED_TENANTS = [
    {
        name: "Urban Threads",
        slug: "urban-threads",
        plan: "pro",
        status: "active" as const,
    },
    {
        name: "Luxe Footwear",
        slug: "luxe-footwear",
        plan: "starter",
        status: "active" as const,
    },
    {
        name: "Belle Accessories",
        slug: "belle-accessories",
        plan: "pro",
        status: "active" as const,
    },
    {
        name: "Glow Beauty Co",
        slug: "glow-beauty-co",
        plan: "enterprise",
        status: "active" as const,
    },
    {
        name: "Thoughtful Gifts Hub",
        slug: "thoughtful-gifts",
        plan: "free",
        status: "active" as const,
    },
];

export async function seedTenants() {
    console.log("🌱 Seeding Tenants & Users...");

    // await db.transaction(async (tx) => {
    for (const t of SEED_TENANTS) {
        // 1. Upsert Tenant
        const [tenant] = await db
            .insert(tenants)
            .values({
                name: t.name,
                slug: t.slug,
                plan: t.plan,
                status: t.status,
                billingEmail: `billing@${t.slug}.test`,
            })
            .onConflictDoUpdate({
                target: tenants.slug,
                set: { plan: t.plan, status: t.status },
            })
            .returning();

        if (!tenant) continue;

        // 2. Create Owner User
        const ownerEmail = `owner@${t.slug}.test`;
        const [owner] = await db
            .insert(users)
            .values({
                id: `user_owner_${t.slug}`, // Deterministic ID for testing
                name: `${t.name} Owner`,
                email: ownerEmail,
                image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.slug}`,
                emailVerified: true,
            })
            .onConflictDoUpdate({
                target: users.email,
                set: { name: `${t.name} Owner` },
            })
            .returning();

        // 3. Link Owner
        await db
            .insert(tenantMemberships)
            .values({
                tenantId: tenant.id,
                userId: owner.id,
                role: "owner",
            })
            .onConflictDoNothing();

        // 4. Create Staff Users (2 per tenant)
        for (let i = 1; i <= 2; i++) {
            const staffEmail = `staff${i}@${t.slug}.test`;
            const [staff] = await db
                .insert(users)
                .values({
                    id: `user_staff${i}_${t.slug}`,
                    name: `${t.name} Staff ${i}`,
                    email: staffEmail,
                    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${staffEmail}`,
                    emailVerified: true,
                })
                .onConflictDoUpdate({
                    target: users.email,
                    set: { name: `${t.name} Staff ${i}` },
                })
                .returning();

            await db
                .insert(tenantMemberships)
                .values({
                    tenantId: tenant.id,
                    userId: staff.id,
                    role: "member",
                })
                .onConflictDoNothing();
        }
    }
    // });

    console.log("✅ Tenants & Users seeded");
}
