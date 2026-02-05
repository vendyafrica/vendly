import { db } from "@vendly/db/db";
import { users, verification, platformRoles, account } from "@vendly/db/schema";
import { NextResponse } from "next/server";
import { sendAdminVerificationEmail } from "@vendly/transactional";
import { eq } from "@vendly/db";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Email, password, and name are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 422 }
            );
        }

        // Hash password using better-auth's method
        const { hashPassword } = await import("better-auth/crypto");
        const hashedPassword = await hashPassword(password);

        // Create user
        const [newUser] = await db
            .insert(users)
            .values({
                email,
                name,
                emailVerified: false,
            })
            .returning();

        // Create account with password for email/password authentication
        await db.insert(account).values({
            userId: newUser.id,
            accountId: newUser.id,
            providerId: "credential",
            password: hashedPassword,
        });

        // Create verification token
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await db.insert(verification).values({
            identifier: email,
            value: token,
            expiresAt,
        });

        // Create verification URL - use our custom verification endpoint
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000";
        const verificationUrl = `${baseUrl}/api/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

        // Send admin verification email
        await sendAdminVerificationEmail({
            to: email,
            name,
            verificationUrl,
        });

        return NextResponse.json({
            success: true,
            message: "Account created! Please check your email to verify your account.",
        });
    } catch (error) {
        console.error("Admin signup error:", error);
        return NextResponse.json(
            { error: "Failed to create account. Please try again." },
            { status: 500 }
        );
    }
}
