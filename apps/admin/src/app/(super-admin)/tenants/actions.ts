"use server";

import { db, tenants } from "@vendly/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTenant(formData: FormData) {
    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const billingEmail = formData.get("billingEmail") as string;
    const plan = formData.get("plan") as string;

    const slug = formData.get("slug") as string || fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (!fullName || !slug) {
        throw new Error("Full Name and Slug are required");
    }

    await db.insert(tenants).values({
        fullName,
        phoneNumber: phoneNumber || null,
        billingEmail: billingEmail || null,
        plan: plan || "free",
        status: "active", // Default to active for now since we are manually creating
    });

    revalidatePath("/tenants");
    return { success: true };
}
