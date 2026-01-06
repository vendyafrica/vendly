import { db, tenants } from '@vendly/db';
import { 
  getStoreBySlug, 
  getProductsByStoreSlug, 
  getCategoriesByStoreSlug,
  getProductImages 
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

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ subdomain: string }>;
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
  const error = tenant.error ?? undefined;

  // Show pending/failed status pages
  if (status !== 'ready' && status !== 'deployed') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-semibold">{subdomain}.{rootDomain}</h1>
        {status === 'failed' ? (
          <p className="text-muted-foreground mt-3 text-center max-w-xl">
            Store generation failed{error ? `: ${error}` : '.'}
          </p>
        ) : (
          <p className="text-muted-foreground mt-3 text-center max-w-xl">
            Your storefront is being generated. Refresh in a moment.
          </p>
        )}
      </main>
    );
  }

  // NOTE: demoUrl/iframe logic commented out - using default template instead
  // const demoUrl = tenant.demoUrl as string | undefined;
  // if (demoUrl) {
  //   return (
  //     <main className="min-h-screen w-full">
  //       <iframe
  //         src={demoUrl}
  //         className="w-full h-screen border-0"
  //         sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
  //         title={`${subdomain} Storefront`}
  //       />
  //     </main>
  //   );
  // }

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

  // Fetch products and categories
  const [products, categories] = await Promise.all([
    store ? getProductsByStoreSlug(subdomain) : Promise.resolve([]),
    store ? getCategoriesByStoreSlug(subdomain) : Promise.resolve([]),
  ]);

  // Fetch first image for each product
  const productsWithImages = await Promise.all(
    products.map(async (product) => {
      const images = await getProductImages(product.id);
      return {
        ...product,
        imageUrl: images[0]?.url,
      };
    })
  );

  // Default Template: Use storefront components with database data
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header storeSlug={subdomain} storeName={storeData.name} />
        <HeroSection store={storeData} storeSlug={subdomain} />
        <CategoryTabs storeSlug={subdomain} categories={categories} />
        <main className="flex-1 bg-white">
          <ProductGrid storeSlug={subdomain} products={productsWithImages} />
          <FeaturedSections storeSlug={subdomain} storeName={storeData.name} />
        </main>
        <Footer 
          storeSlug={subdomain} 
          storeName={storeData.name} 
          storeDescription={storeData.description ?? undefined} 
        />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
