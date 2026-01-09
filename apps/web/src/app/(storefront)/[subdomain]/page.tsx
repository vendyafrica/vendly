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
// Plasmic integration
import { PLASMIC } from "@/lib/plasmic-init";
import {
  PlasmicRootProvider,
  PlasmicComponent,
  extractPlasmicQueryData,
} from "@plasmicapp/loader-nextjs";

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

  // Valid statuses for rendering the storefront
  const validStatuses = ['active', 'ready'];

  // Show pending/failed status pages
  if (!validStatuses.includes(status)) {
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

  // Check if store uses a Plasmic template
  // Type assertion needed until db schema types are refreshed
  const plasmicTemplate = (tenant as { plasmicTemplate?: string }).plasmicTemplate;

  if (plasmicTemplate) {
    try {
      const plasmicData = await PLASMIC.fetchComponentData(plasmicTemplate);

      if (plasmicData && plasmicData.entryCompMetas.length > 0) {
        const compMeta = plasmicData.entryCompMetas[0];

        // Pre-fetch query data for SSR
        const queryCache = await extractPlasmicQueryData(
          <PlasmicRootProvider
            loader={PLASMIC}
            prefetchedData={plasmicData}
            pageParams={{ storeSlug: subdomain }}
          >
            <PlasmicComponent
              component={plasmicTemplate}
              componentProps={{
                storeSlug: subdomain,
              }}
            />
          </PlasmicRootProvider>
        );

        // Render with Plasmic
        return (
          <CartProvider>
            <PlasmicRootProvider
              loader={PLASMIC}
              prefetchedData={plasmicData}
              prefetchedQueryData={queryCache}
              pageParams={{ storeSlug: subdomain }}
            >
              <PlasmicComponent
                component={plasmicTemplate}
                componentProps={{
                  storeSlug: subdomain,
                }}
              />
            </PlasmicRootProvider>
            <CartDrawer />
          </CartProvider>
        );
      }
    } catch (error) {
      console.error("Failed to load Plasmic template:", error);
      // Fall through to other rendering methods
    }
  }

  // Check for AI Generated Files (Blob Storage) and render them if available
  // This logic runs if no Plasmic template or custom Puck editor data exists
  interface GeneratedFile { name: string; url: string; }
  const generatedFiles = tenant.generatedFiles as unknown as GeneratedFile[] | null;

  if (generatedFiles && Array.isArray(generatedFiles) && generatedFiles.length > 0) {
    const indexFile = generatedFiles.find(f => f.name === 'index.html');
    const cssFile = generatedFiles.find(f => f.name === 'styles.css');
    const jsFile = generatedFiles.find(f => f.name === 'app.js');

    if (indexFile?.url) {
      try {
        const response = await fetch(indexFile.url);
        if (response.ok) {
          let htmlContent = await response.text();

          // Inject CSS Blob URL
          if (cssFile?.url) {
            // Replace link tag if it exists (assuming specific filename match)
            htmlContent = htmlContent.replace('href="styles.css"', `href="${cssFile.url}"`);

            // Or inject if not found
            if (!htmlContent.includes(cssFile.url)) {
              htmlContent = htmlContent.replace('</head>', `<link rel="stylesheet" href="${cssFile.url}"></head>`);
            }
          }

          // Inject JS Blob URL
          if (jsFile?.url) {
            // Replace script src if it exists
            htmlContent = htmlContent.replace('src="app.js"', `src="${jsFile.url}"`);

            // Or inject if not found
            if (!htmlContent.includes(jsFile.url)) {
              htmlContent = htmlContent.replace('</body>', `<script src="${jsFile.url}"></script></body>`);
            }
          }

          // Render the fetched HTML
          // Note: This renders inside the existing layout (Header/Footer from layout.tsx might still apply 
          // if it's in the root layout, but [subdomain] doesn't have its own layout).
          // We wrap it in a div to avoid hydration mismatch if possible, though full HTML injection is risky.
          return (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          );
        }
      } catch (err) {
        console.error("Failed to fetch generated storefront:", err);
        // Fallthrough to default template
      }
    }
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
