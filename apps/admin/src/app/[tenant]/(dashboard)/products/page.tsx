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

  // 3. Get Products for the store with their images and variants
  const dbProducts = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.storeId, store.id),
    with: {
      media: {
        with: {
          media: true
        }
      },
      variants: true
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)]
  })

  // 4. Map to UI Model
  const mappedProducts: Product[] = dbProducts.map(p => {
    // Find the image with the lowest sortOrder
    const sortedMedia = p.media?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    const mainImage = sortedMedia && sortedMedia.length > 0 ? sortedMedia[0].media?.blobUrl : undefined

    // Stock removed for now
    const totalStock = 0

    // Determine display price (use base price or first variant price)
    const price = (p.priceAmount || p.variants[0]?.priceAmount || 0) / 100

    // Variant info string
    const variantInfo = p.variants.length > 1
      ? `${p.variants.length} variants`
      : (p.variants[0]?.title && p.variants[0]?.title !== "Default" ? p.variants[0]?.title : "")

    return {
      id: p.id,
      name: p.title,
      variant: variantInfo,
      price: price,
      sales: "0",
      revenue: "$0.00",
      stock: totalStock,
      status: "Active", // Fixed string as status is missing from schema
      rating: 0,
      selected: false,
      image: mainImage
    }
  })

  return <ProductsClient products={mappedProducts} tenantSlug={tenantSlug} />
}
