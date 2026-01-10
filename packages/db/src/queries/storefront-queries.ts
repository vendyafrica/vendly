import { eq, and, desc, asc } from "drizzle-orm";
import { edgeDb } from "../db";
import {
  stores,
  storeThemes,
  storeContent,
  type Store,
  type StoreTheme,
  type StoreContent,
  type FeaturedSectionConfig
} from "../schema/storefront-schema";
import {
  products,
  productMedia,
  mediaObjects,
  productCategories,
  type Product,
} from "../schema/product-schema";
export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  sortOrder: number;
};
import {
  storeCategories as categories,
  type StoreCategory as Category
} from "../schema/index";

// Store queries
export async function getStoreBySlug(slug: string): Promise<Store | undefined> {
  const [store] = await edgeDb
    .select()
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);

  return store;
}

export async function getStoreByTenantId(tenantId: string): Promise<Store | undefined> {
  const [store] = await edgeDb
    .select()
    .from(stores)
    .where(eq(stores.tenantId, tenantId))
    .limit(1);

  return store;
}

export async function createStore(data: {
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
}): Promise<Store> {
  const [store] = await edgeDb
    .insert(stores)
    .values(data)
    .returning();

  return store;
}

// Product queries
export async function getProductsByStoreSlug(slug: string, options?: {
  limit?: number;
  offset?: number;
  status?: "active" | "archived" | "draft";
}): Promise<Product[]> {
  const { limit = 50, offset = 0, status = "active" } = options || {};

  const storeProducts = await edgeDb
    .select()
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .where(and(
      eq(stores.slug, slug),
      eq(products.status, status)
    ))
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);

  // Map result to just Product[]
  // Drizzle innerJoin returns { products: ..., stores: ... }
  return storeProducts.map(row => row.products);


}

export async function getProductById(id: string): Promise<Product & { images: ProductImage[] } | undefined> {
  // We need to join products with productMedia and mediaObjects to simulate legacy "images"
  const rows = await edgeDb
    .select({
      product: products,
      media: productMedia,
      mediaObj: mediaObjects
    })
    .from(products)
    .leftJoin(productMedia, eq(products.id, productMedia.productId))
    .leftJoin(mediaObjects, eq(productMedia.mediaId, mediaObjects.id))
    .where(eq(products.id, id))
    .orderBy(asc(productMedia.sortOrder));

  if (rows.length === 0) return undefined;

  const firstRow = rows[0];
  const { product } = firstRow;

  const images: ProductImage[] = rows
    .filter(r => r.media && r.mediaObj)
    .map(r => ({
      id: r.media!.id,
      productId: r.product.id,
      url: r.mediaObj!.blobUrl,
      sortOrder: r.media!.sortOrder ?? 0
    }));

  return {
    ...product,
    images
  };
}

export async function createProduct(data: {
  storeId: string;
  title: string;
  description?: string;
  priceAmount: number;
  currency?: string;
  status?: "active" | "archived" | "draft";
}): Promise<Product> {
  // Fetch store to get tenantId
  const [store] = await edgeDb.select({ tenantId: stores.tenantId }).from(stores).where(eq(stores.id, data.storeId)).limit(1);
  if (!store) throw new Error("Store not found");

  const [product] = await edgeDb
    .insert(products)
    .values({
      storeId: data.storeId,
      title: data.title,
      description: data.description,
      basePriceAmount: data.priceAmount,
      baseCurrency: data.currency ?? "KES",
      status: data.status ?? "draft",
      tenantId: store.tenantId,
      // Fix: Generate slug if missing (basic slugify)
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    })
    .returning();

  return product;
}

// Product Image queries
export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const rows = await edgeDb
    .select({
      media: productMedia,
      mediaObj: mediaObjects
    })
    .from(productMedia)
    .innerJoin(mediaObjects, eq(productMedia.mediaId, mediaObjects.id))
    .where(eq(productMedia.productId, productId))
    .orderBy(asc(productMedia.sortOrder));

  return rows.map(r => ({
    id: r.media.id,
    productId: r.media.productId,
    url: r.mediaObj.blobUrl,
    sortOrder: r.media.sortOrder ?? 0
  }));
}

// TODO: This function is problematic because `productImages` is gone.
// We should use `addMediaToProduct`.
// For now, I will throw or implement a mock that fails if we don't have mediaObjects logic here.
// But wait, the frontend might call this with a direct URL (cloudinary/etc). 
// `mediaObjects` requires an entry there first.
// I will implement a bridge: Create mediaObject then link it.
export async function addProductImage(data: {
  productId: string;
  url: string;
  sortOrder?: number;
}): Promise<ProductImage> {
  // 1. Get tenantId from product
  const [product] = await edgeDb.select({ tenantId: products.tenantId }).from(products).where(eq(products.id, data.productId)).limit(1);
  if (!product) throw new Error("Product not found");

  // 2. Create mediaObject
  const [mediaObj] = await edgeDb.insert(mediaObjects).values({
    tenantId: product.tenantId,
    blobUrl: data.url
  }).returning();

  // 3. Link
  const [link] = await edgeDb.insert(productMedia).values({
    tenantId: product.tenantId,
    productId: data.productId,
    mediaId: mediaObj.id,
    sortOrder: data.sortOrder ?? 0
  }).returning();

  return {
    id: link.id,
    productId: link.productId,
    url: mediaObj.blobUrl,
    sortOrder: link.sortOrder ?? 0
  };
}

// Category queries
export async function getCategoriesByStoreSlug(slug: string): Promise<Category[]> {
  const storeCategories = await edgeDb
    .select({
      id: categories.id,
      tenantId: categories.tenantId,
      storeId: categories.storeId,
      platformCategoryId: categories.platformCategoryId,
      name: categories.name,
      slug: categories.slug,
      imageUrl: categories.imageUrl,
      description: categories.description,
      sortOrder: categories.sortOrder,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
    })
    .from(categories)
    .innerJoin(stores, eq(categories.storeId, stores.id))
    .where(eq(stores.slug, slug))
    .orderBy(asc(categories.name));

  return storeCategories;
}

export async function createCategory(data: {
  storeId: string;
  name: string;
  slug: string;
  imageUrl?: string;
}): Promise<Category> {
  // Fetch store to get tenantId
  const [store] = await edgeDb.select({ tenantId: stores.tenantId }).from(stores).where(eq(stores.id, data.storeId)).limit(1);
  if (!store) throw new Error("Store not found");

  const [category] = await edgeDb
    .insert(categories)
    .values({
      storeId: data.storeId,
      name: data.name,
      slug: data.slug,
      imageUrl: data.imageUrl,
      tenantId: store.tenantId
    })
    .returning();

  return category;
}

// Product-Category junction queries
export async function addProductToCategory(productId: string, categoryId: string): Promise<void> {
  await edgeDb
    .insert(productCategories)
    .values({ productId, categoryId })
    .onConflictDoNothing();
}

export async function getProductsByCategorySlug(
  storeSlug: string,
  categorySlug: string
): Promise<Product[]> {
  const categoryProducts = await edgeDb
    .select()
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .innerJoin(productCategories, eq(products.id, productCategories.productId))
    .innerJoin(categories, eq(productCategories.categoryId, categories.id))
    .where(and(
      eq(stores.slug, storeSlug),
      eq(categories.slug, categorySlug),
      eq(products.status, "active")
    ))
    .orderBy(desc(products.createdAt));

  return categoryProducts.map(row => row.products);


}

// Delete functions
export async function deleteStore(storeId: string): Promise<void> {
  await edgeDb.delete(stores).where(eq(stores.id, storeId));
}

export async function deleteProductsByStoreId(storeId: string): Promise<void> {
  await edgeDb.delete(products).where(eq(products.storeId, storeId));
}

export async function deleteCategoriesByStoreId(storeId: string): Promise<void> {
  await edgeDb.delete(categories).where(eq(categories.storeId, storeId));
}

// Store Theme queries
export async function getStoreTheme(storeId: string): Promise<StoreTheme | undefined> {
  const [theme] = await edgeDb
    .select()
    .from(storeThemes)
    .where(eq(storeThemes.storeId, storeId))
    .limit(1);

  return theme;
}

export async function getStoreThemeBySlug(slug: string): Promise<StoreTheme | undefined> {
  const store = await getStoreBySlug(slug);
  if (!store) return undefined;
  return getStoreTheme(store.id);
}

export async function upsertStoreTheme(data: {
  storeId: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  headingFont?: string;
  bodyFont?: string;
}): Promise<StoreTheme> {

  const existing = await getStoreTheme(data.storeId);
  if (existing) {
    const [updated] = await edgeDb
      .update(storeThemes)
      .set(data)
      .where(eq(storeThemes.storeId, data.storeId))
      .returning();
    return updated;
  }

  // Fetch store to get tenantId
  const [store] = await edgeDb.select({ tenantId: stores.tenantId }).from(stores).where(eq(stores.id, data.storeId)).limit(1);
  if (!store) throw new Error("Store not found");

  const [created] = await edgeDb
    .insert(storeThemes)
    .values({
      ...data,
      tenantId: store.tenantId
    })
    .returning();

  return created;
}

// Store Content queries
export async function getStoreContent(storeId: string): Promise<StoreContent | undefined> {
  const [content] = await edgeDb
    .select()
    .from(storeContent)
    .where(eq(storeContent.storeId, storeId))
    .limit(1);

  return content;
}

export async function getStoreContentBySlug(slug: string): Promise<StoreContent | undefined> {
  const store = await getStoreBySlug(slug);
  if (!store) return undefined;
  return getStoreContent(store.id);
}

export async function upsertStoreContent(data: {
  storeId: string;
  heroLabel?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCta?: string;
  heroImageUrl?: string;
  featuredSections?: FeaturedSectionConfig[];
  footerDescription?: string;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
}): Promise<StoreContent> {
  const existing = await getStoreContent(data.storeId);

  if (existing) {
    const [updated] = await edgeDb
      .update(storeContent)
      .set(data)
      .where(eq(storeContent.storeId, data.storeId))
      .returning();
    return updated;
  }

  // Fetch store to get tenantId
  const [store] = await edgeDb.select({ tenantId: stores.tenantId }).from(stores).where(eq(stores.id, data.storeId)).limit(1);
  if (!store) throw new Error("Store not found");

  const [created] = await edgeDb
    .insert(storeContent)
    .values({
      ...data,
      tenantId: store.tenantId
    })
    .returning();

  return created;
}

// Combined store customization data
export interface StoreCustomization {
  theme: StoreTheme | null;
  content: StoreContent | null;
}

export async function getStoreCustomization(storeId: string): Promise<StoreCustomization> {
  const [theme, content] = await Promise.all([
    getStoreTheme(storeId),
    getStoreContent(storeId),
  ]);

  return { theme: theme ?? null, content: content ?? null };
}

export async function getStoreCustomizationBySlug(slug: string): Promise<StoreCustomization | null> {
  const store = await getStoreBySlug(slug);
  if (!store) return null;
  return getStoreCustomization(store.id);
}

// Page Data functions for Puck editor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStorePageData(storeId: string): Promise<any | null> {
  const content = await getStoreContent(storeId);
  return content?.editorData ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStorePageDataBySlug(slug: string): Promise<any | null> {
  const store = await getStoreBySlug(slug);
  if (!store) return null;
  return getStorePageData(store.id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertStorePageData(storeId: string, pageData: any): Promise<StoreContent> {
  // Fetch store to get tenantId
  const [store] = await edgeDb.select({ tenantId: stores.tenantId }).from(stores).where(eq(stores.id, storeId)).limit(1);
  if (!store) throw new Error("Store not found");

  const existing = await getStoreContent(storeId);

  if (existing) {
    const [updated] = await edgeDb
      .update(storeContent)
      .set({ editorData: pageData })
      .where(eq(storeContent.storeId, storeId))
      .returning();
    return updated;
  }

  const [created] = await edgeDb
    .insert(storeContent)
    .values({ storeId, editorData: pageData, tenantId: store.tenantId })
    .returning();

  return created;
}
