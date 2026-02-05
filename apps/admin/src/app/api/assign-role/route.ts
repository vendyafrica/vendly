import { db } from "@vendly/db/db";
import { platformRoles } from "@vendly/db/schema";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";

export async function POST(req: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user already has a platform role
        const existingRole = await db.query.platformRoles.findFirst({
            where: (roles, { eq }) => eq(roles.userId, session.user.id),
        });

        if (existingRole) {
            return NextResponse.json({
                success: true,
                role: existingRole.role,
                message: "Role already assigned"
            });
        }

        // Assign super_admin role to the new user
        await db.insert(platformRoles).values({
            userId: session.user.id,
            name: session.user.name,
            role: "super_admin",
        });

        return NextResponse.json({
            success: true,
            role: "super_admin",
            message: "Super admin role assigned successfully"
        });
    } catch (error) {
        console.error("Assign role error:", error);
        return NextResponse.json(
            { error: "Failed to assign role" },
            { status: 500 }
        );
    }
}
