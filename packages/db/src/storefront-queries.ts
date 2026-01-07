import { eq, and, desc, asc } from "drizzle-orm";
import { db } from "./db";
import {
  stores,
  products,
  productImages,
  categories,
  productCategories,
  storeThemes,
  storeContent,
  type Store,
  type Product,
  type Category,
  type ProductImage,
  type StoreTheme,
  type StoreContent,
  type FeaturedSectionConfig
} from "./schema/storefront-schema";
import { tenants } from "./schema/tenant";

// Store queries
export async function getStoreBySlug(slug: string): Promise<Store | undefined> {
  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);

  return store;
}

export async function getStoreByTenantId(tenantId: string): Promise<Store | undefined> {
  const [store] = await db
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
  const [store] = await db
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

  const storeProducts = await db
    .select({
      id: products.id,
      storeId: products.storeId,
      title: products.title,
      description: products.description,
      priceAmount: products.priceAmount,
      currency: products.currency,
      status: products.status,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .where(and(
      eq(stores.slug, slug),
      eq(products.status, status)
    ))
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);

  return storeProducts;
}

export async function getProductById(id: string): Promise<Product & { images: ProductImage[] } | undefined> {
  const productWithImages = await db
    .select({
      id: products.id,
      storeId: products.storeId,
      title: products.title,
      description: products.description,
      priceAmount: products.priceAmount,
      currency: products.currency,
      status: products.status,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      images: productImages,
    })
    .from(products)
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .where(eq(products.id, id))
    .orderBy(asc(productImages.sortOrder));

  if (productWithImages.length === 0) return undefined;

  // Group images by product
  const product = {
    ...productWithImages[0],
    images: productWithImages
      .filter(row => row.images)
      .map(row => row.images!)
  };

  return product;
}

export async function createProduct(data: {
  storeId: string;
  title: string;
  description?: string;
  priceAmount: number;
  currency?: string;
  status?: "active" | "archived" | "draft";
}): Promise<Product> {
  const [product] = await db
    .insert(products)
    .values(data)
    .returning();

  return product;
}

// Product Image queries
export async function getProductImages(productId: string): Promise<ProductImage[]> {
  return db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.sortOrder));
}

export async function addProductImage(data: {
  productId: string;
  url: string;
  sortOrder?: number;
}): Promise<ProductImage> {
  const [image] = await db
    .insert(productImages)
    .values(data)
    .returning();

  return image;
}

// Category queries
export async function getCategoriesByStoreSlug(slug: string): Promise<Category[]> {
  const storeCategories = await db
    .select({
      id: categories.id,
      storeId: categories.storeId,
      name: categories.name,
      slug: categories.slug,
      imageUrl: categories.imageUrl,
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
  const [category] = await db
    .insert(categories)
    .values(data)
    .returning();

  return category;
}

// Product-Category junction queries
export async function addProductToCategory(productId: string, categoryId: string): Promise<void> {
  await db
    .insert(productCategories)
    .values({ productId, categoryId })
    .onConflictDoNothing();
}

export async function getProductsByCategorySlug(
  storeSlug: string,
  categorySlug: string
): Promise<Product[]> {
  const categoryProducts = await db
    .select({
      id: products.id,
      storeId: products.storeId,
      title: products.title,
      description: products.description,
      priceAmount: products.priceAmount,
      currency: products.currency,
      status: products.status,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
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

  return categoryProducts;
}

// Delete functions
export async function deleteStore(storeId: string): Promise<void> {
  await db.delete(stores).where(eq(stores.id, storeId));
}

export async function deleteProductsByStoreId(storeId: string): Promise<void> {
  await db.delete(products).where(eq(products.storeId, storeId));
}

export async function deleteCategoriesByStoreId(storeId: string): Promise<void> {
  await db.delete(categories).where(eq(categories.storeId, storeId));
}

// Store Theme queries
export async function getStoreTheme(storeId: string): Promise<StoreTheme | undefined> {
  const [theme] = await db
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
    const [updated] = await db
      .update(storeThemes)
      .set(data)
      .where(eq(storeThemes.storeId, data.storeId))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(storeThemes)
    .values(data)
    .returning();

  return created;
}

// Store Content queries
export async function getStoreContent(storeId: string): Promise<StoreContent | undefined> {
  const [content] = await db
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
    const [updated] = await db
      .update(storeContent)
      .set(data)
      .where(eq(storeContent.storeId, data.storeId))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(storeContent)
    .values(data)
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
  return content?.pageData ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStorePageDataBySlug(slug: string): Promise<any | null> {
  const store = await getStoreBySlug(slug);
  if (!store) return null;
  return getStorePageData(store.id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertStorePageData(storeId: string, pageData: any): Promise<StoreContent> {
  const existing = await getStoreContent(storeId);

  if (existing) {
    const [updated] = await db
      .update(storeContent)
      .set({ pageData })
      .where(eq(storeContent.storeId, storeId))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(storeContent)
    .values({ storeId, pageData })
    .returning();

  return created;
}
