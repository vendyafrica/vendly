"use server"

import { db } from "@vendly/db"
import { products, tenants, stores, productImages } from "@vendly/db/schema"
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
        if (data.price !== undefined) {
            updateData.priceAmount = data.price
        }
        if (data.stock !== undefined) {
            updateData.inventoryQuantity = data.stock
        }
        if (data.status !== undefined) {
            updateData.status = data.status
        }

        if (Object.keys(updateData).length === 0) {
            return { success: true }
        }

        await db
            .update(products)
            .set(updateData)
            .where(eq(products.id, productId))

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
        const [newProduct] = await db.insert(products).values({
            storeId: store.id,
            title: data.title,
            priceAmount: Math.round(data.price * 100),
            inventoryQuantity: data.stock,
            status: "active",
        }).returning()

        // 3. Create Image if provided
        if (data.imageUrl) {
            await db.insert(productImages).values({
                productId: newProduct.id,
                url: data.imageUrl,
                sortOrder: 0,
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

