"use server"

import { db } from "@vendly/db"
import { products, tenants, stores, productVariants, inventoryItems, mediaObjects, productMedia } from "@vendly/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updateProduct(
    productId: string,
    tenantSlug: string,
    data: {
        title?: string
        price?: number
        stock?: number
        status?: "active" | "archived" | "draft"
    }
) {
    try {
        const updateData: Partial<typeof products.$inferInsert> = {}

        if (data.title !== undefined) {
            updateData.title = data.title
        }
        if (data.status !== undefined) {
            updateData.status = data.status
        }
        // Base price update on product
        if (data.price !== undefined) {
            updateData.basePriceAmount = Math.round(data.price * 100)
        }

        if (Object.keys(updateData).length > 0) {
            await db
                .update(products)
                .set(updateData)
                .where(eq(products.id, productId))
        }

        // Update variants and inventory if needed
        // Assuming single variant for now.
        const variants = await db.select().from(productVariants).where(eq(productVariants.productId, productId));
        if (variants.length > 0) {
            const variantId = variants[0].id;
            if (data.price !== undefined) {
                await db.update(productVariants)
                    .set({ priceAmount: Math.round(data.price * 100) })
                    .where(eq(productVariants.id, variantId))
            }
            if (data.stock !== undefined) {
                await db.update(inventoryItems)
                    .set({ quantityOnHand: data.stock })
                    .where(eq(inventoryItems.variantId, variantId));
            }
        }

        return { success: true }
    } catch (error) {
        console.error("Failed to update product:", error)
        return { success: false, error: "Failed to update product" }
    }
}

export async function createProduct(
    tenantSlug: string,
    data: {
        title: string
        price: number
        stock: number
        imageUrl?: string
    }
) {
    try {
        // 1. Get Tenant & Store
        const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug))
        if (!tenant) throw new Error("Tenant not found")

        const [store] = await db.select().from(stores).where(eq(stores.tenantId, tenant.id))
        if (!store) throw new Error("Store not found")

        // 2. Create Product
        const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + "-" + Date.now();

        const [newProduct] = await db.insert(products).values({
            tenantId: tenant.id,
            storeId: store.id,
            title: data.title,
            slug: slug,
            basePriceAmount: Math.round(data.price * 100),
            status: "active",
        }).returning()

        // 3. Create Default Variant
        const [newVariant] = await db.insert(productVariants).values({
            tenantId: tenant.id,
            productId: newProduct.id,
            priceAmount: Math.round(data.price * 100),
            title: "Default",
            options: {},
        }).returning();

        // 4. Create Inventory Link
        await db.insert(inventoryItems).values({
            tenantId: tenant.id,
            variantId: newVariant.id,
            quantityOnHand: data.stock
        });

        // 5. Create Image if provided
        if (data.imageUrl) {
            const [media] = await db.insert(mediaObjects).values({
                tenantId: tenant.id,
                blobUrl: data.imageUrl,
            }).returning();

            await db.insert(productMedia).values({
                tenantId: tenant.id,
                productId: newProduct.id,
                mediaId: media.id,
                variantId: newVariant.id
            })
        }

        return { success: true, product: newProduct }
    } catch (error) {
        console.error("Failed to create product:", error)
        return { success: false, error: "Failed to create product" }
    }
}

export async function deleteProduct(productId: string, tenantSlug: string) {
    try {
        await db.delete(products).where(eq(products.id, productId))
        return { success: true }
    } catch (error) {
        console.error("Failed to delete product:", error)
        return { success: false, error: "Failed to delete product" }
    }
}

export async function deleteAllProducts(tenantSlug: string) {
    try {
        const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug))
        if (!tenant) throw new Error("Tenant not found")

        const [store] = await db.select().from(stores).where(eq(stores.tenantId, tenant.id))
        if (!store) throw new Error("Store not found")

        await db.delete(products).where(eq(products.storeId, store.id))

        return { success: true }
    } catch (error) {
        console.error("Failed to delete all products:", error)
        return { success: false, error: "Failed to delete all products" }
    }
}

