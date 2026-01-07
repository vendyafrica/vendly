import { db, tenants } from '@vendly/db';
import {
  getStoreBySlug,
  getProductsByStoreSlug,
  getCategoriesByStoreSlug,
  getProductImages,
  getStoreCustomization
} from '@vendly/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Header } from '@/components/storefront';
import { HeroSection } from '@/components/storefront';
import { CategoryTabs } from '@/components/storefront';
import { ProductGrid } from '@/components/storefront';
import { CartProvider } from '@/components/storefront';
import { CartDrawer } from '@/components/storefront';
import { Footer } from '@/components/storefront';
import { FeaturedSections } from '@/components/storefront';
import { PuckRenderer } from '@/components/storefront/PuckRenderer';
import { type Data } from "@measured/puck";
import { type Components, type RootProps } from "@/lib/puck-config";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ subdomain: string }>;
};

// Default theme values
const defaultTheme = {
  primaryColor: "#1a1a2e",
  secondaryColor: "#4a6fa5",
  accentColor: "#ffffff",
  backgroundColor: "#ffffff",
  textColor: "#1a1a2e",
  headingFont: "Inter",
  bodyFont: "Inter",
};

// Default content values
const defaultContent = {
  heroLabel: "Urban Style",
  heroTitle: null as string | null,
  heroSubtitle: "Explore our curated selection of premium products designed for the modern lifestyle.",
  heroCta: "Discover Now",
  newsletterTitle: "Subscribe to our newsletter",
  newsletterSubtitle: "Get the latest updates on new products and upcoming sales",
};

export default async function TenantPage({ params }: Props) {
  const { subdomain } = await params;

  // Fetch tenant to verify it exists and check status
  const [tenant] = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, subdomain))
    .limit(1);

  if (!tenant) {
    notFound();
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'vendlyafrica.store';
  const status = tenant.status;

  // Show pending/failed status pages
  if (status !== 'active') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-semibold">{subdomain}.{rootDomain}</h1>
        {status === 'suspended' ? (
          <p className="text-muted-foreground mt-3 text-center max-w-xl">
            Store is suspended.
          </p>
        ) : (
          <p className="text-muted-foreground mt-3 text-center max-w-xl">
            Your storefront is being generated. Refresh in a moment.
          </p>
        )}
      </main>
    );
  }

  // Fetch store data from database
  const store = await getStoreBySlug(subdomain);

  // If no store exists yet, create a temporary store object from tenant
  const storeData = store || {
    id: tenant.id,
    name: subdomain.charAt(0).toUpperCase() + subdomain.slice(1),
    slug: subdomain,
    description: null,
    logoUrl: null,
  };

  // Fetch products, categories, and customization
  const [products, categories, customization] = await Promise.all([
    store ? getProductsByStoreSlug(subdomain) : Promise.resolve([]),
    store ? getCategoriesByStoreSlug(subdomain) : Promise.resolve([]),
    store ? getStoreCustomization(storeData.id) : Promise.resolve({ theme: null, content: null }),
  ]);

  // Check if we have Puck page data - if so, render with Puck
  const pageData = customization.content?.pageData as Data<Components, RootProps> | null;

  if (pageData && pageData.content && pageData.content.length > 0) {
    // Inject storeSlug into all block props so components can fetch store-specific data
    const dataWithStoreSlug: Data<Components, RootProps> = {
      ...pageData,
      root: pageData.root || { props: { title: storeData.name as string } },
      content: pageData.content.map((block) => ({
        ...block,
        props: {
          ...block.props,
          storeSlug: subdomain, // Inject the subdomain as storeSlug
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        } as any, // Cast props to any for simpler injection of storeSlug
      })),
    };

    // Render using Puck with saved page data
    return (
      <CartProvider>
        <PuckRenderer data={dataWithStoreSlug} />
        <CartDrawer />
      </CartProvider>
    );
  }

  // Fallback: Use traditional component-based rendering
  // Merge with defaults
  const theme = {
    primaryColor: customization.theme?.primaryColor || defaultTheme.primaryColor,
    secondaryColor: customization.theme?.secondaryColor || defaultTheme.secondaryColor,
    accentColor: customization.theme?.accentColor || defaultTheme.accentColor,
    backgroundColor: customization.theme?.backgroundColor || defaultTheme.backgroundColor,
    textColor: customization.theme?.textColor || defaultTheme.textColor,
    headingFont: customization.theme?.headingFont || defaultTheme.headingFont,
    bodyFont: customization.theme?.bodyFont || defaultTheme.bodyFont,
  };

  const content = {
    heroLabel: customization.content?.heroLabel || defaultContent.heroLabel,
    heroTitle: customization.content?.heroTitle || defaultContent.heroTitle,
    heroSubtitle: customization.content?.heroSubtitle || defaultContent.heroSubtitle,
    heroCta: customization.content?.heroCta || defaultContent.heroCta,
    heroImageUrl: customization.content?.heroImageUrl || null,
    newsletterTitle: customization.content?.newsletterTitle || defaultContent.newsletterTitle,
    newsletterSubtitle: customization.content?.newsletterSubtitle || defaultContent.newsletterSubtitle,
  };

  // Fetch first image for each product
  const productsWithImages = await Promise.all(
    products.map(async (product) => {
      const images = await getProductImages(product.id);
      return {
        ...product,
        imageUrl: images[0]?.url,
        priceAmount: product.basePriceAmount,
        currency: product.baseCurrency,
      };
    })
  );

  // CSS variables for theme
  const themeStyles = {
    '--theme-primary': theme.primaryColor,
    '--theme-secondary': theme.secondaryColor,
    '--theme-accent': theme.accentColor,
    '--theme-background': theme.backgroundColor,
    '--theme-text': theme.textColor,
    '--theme-heading-font': theme.headingFont,
    '--theme-body-font': theme.bodyFont,
  } as React.CSSProperties;

  // Default Template: Use storefront components with database data
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col" style={themeStyles}>
        <Header
          storeSlug={subdomain}
          storeName={storeData.name}
          theme={theme}
        />
        <HeroSection
          store={storeData}
          storeSlug={subdomain}
          theme={theme}
          content={content}
        />
        <CategoryTabs storeSlug={subdomain} categories={categories} />
        <main className="flex-1" style={{ backgroundColor: theme.backgroundColor }}>
          <ProductGrid storeSlug={subdomain} products={productsWithImages} />
          <FeaturedSections storeSlug={subdomain} storeName={storeData.name} />
        </main>
        <Footer
          storeSlug={subdomain}
          storeName={storeData.name}
          storeDescription={storeData.description ?? undefined}
          theme={theme}
          content={content}
        />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
