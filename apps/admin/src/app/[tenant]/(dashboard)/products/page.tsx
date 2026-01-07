import { db } from "@vendly/db"
import { stores, tenants, products } from "@vendly/db/schema"
import { eq, desc } from "drizzle-orm"
import * as React from "react"
import ProductsClient, { Product } from "./products-client"

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: tenantSlug } = await params

  // 1. Get Tenant
  const [tenant] = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, tenantSlug))

  if (!tenant) {
    return <div className="p-8 text-center text-muted-foreground">Tenant not found</div>
  }

  // 2. Get Store associated with the tenant
  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.tenantId, tenant.id))

  if (!store) {
    return <ProductsClient products={[]} tenantSlug={tenantSlug} />
  }

  // 3. Get Products for the store with their images
  const dbProducts = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.storeId, store.id),
    with: {
      images: true
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)]
  })

  // 4. Map to UI Model
  const mappedProducts: Product[] = dbProducts.map(p => {
    // Find the image with the lowest sortOrder or just the first one
    const sortedImages = p.images?.sort((a, b) => a.sortOrder - b.sortOrder)
    const mainImage = sortedImages && sortedImages.length > 0 ? sortedImages[0].url : undefined

    return {
      id: p.id,
      name: p.title,
      variant: "", 
      price: p.priceAmount / 100,
      sales: "0", 
      revenue: "$0.00", 
      stock: p.inventoryQuantity,
      status: p.status,
      rating: 0, 
      selected: false,
      image: mainImage
    }
  })

  return <ProductsClient products={mappedProducts} tenantSlug={tenantSlug} />
}
