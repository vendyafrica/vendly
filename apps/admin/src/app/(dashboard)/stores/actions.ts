"use server";

import { db, stores } from "@vendly/db";
import { revalidatePath } from "next/cache";

export async function createStore(formData: FormData) {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const tenantId = formData.get("tenantId") as string;

    if (!name || !slug || !tenantId) {
        throw new Error("Name, Slug, and Tenant are required");
    }

    await db.insert(stores).values({
        name,
        slug,
        tenantId,
        status: true,
    });

    revalidatePath("/stores");
    return { success: true };
}
