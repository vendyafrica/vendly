import { db, tenants } from '@vendly/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ subdomain: string }>;
};

export default async function TenantPage({ params }: Props) {
  const { subdomain } = await params;
  
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
  const config = (tenant.storefrontConfig ?? undefined) as any;
  const demoUrl = tenant.demoUrl as string | undefined;

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

  // If we have a demo URL, render the storefront in an iframe
  if (demoUrl) {
    return (
      <main className="min-h-screen w-full">
        <iframe
          src={demoUrl}
          className="w-full h-screen border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          title={`${subdomain} Storefront`}
        />
      </main>
    );
  }

  // Fallback: If no demo URL but we have config, render the config-based UI
  if (!config) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-semibold">{subdomain}.{rootDomain}</h1>
        <p className="text-muted-foreground mt-3 text-center max-w-xl">
          Storefront configuration not found.
        </p>
      </main>
    );
  }

  const theme = config?.theme ?? {};
  const sections = config?.homepage?.sections ?? [];

  const primaryColor = theme.primaryColor ?? '#4f46e5';
  const accentColor = theme.accentColor ?? '#22c55e';
  const backgroundColor = theme.backgroundColor ?? '#ffffff';
  const textColor = theme.textColor ?? '#0f172a';

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor, color: textColor }}
    >
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="font-semibold text-lg">{subdomain}.{rootDomain}</div>
        <nav className="flex items-center gap-4 text-sm">
          <a className="opacity-80 hover:opacity-100" href="#">Home</a>
          <a className="opacity-80 hover:opacity-100" href="#">Shop</a>
          <a className="opacity-80 hover:opacity-100" href="#">Contact</a>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {Array.isArray(sections) && sections.length ? (
          <div className="flex flex-col gap-10">
            {sections.map((section: any, idx: number) => {
              const type = section?.type;
              const props = section?.props ?? {};

              if (type === 'hero') {
                return (
                  <section
                    key={idx}
                    className="rounded-2xl p-10"
                    style={{ backgroundColor: primaryColor, color: '#ffffff' }}
                  >
                    <h1 className="text-4xl font-bold leading-tight">
                      {props.title ?? 'Welcome to our store'}
                    </h1>
                    <p className="mt-4 opacity-90 max-w-2xl">
                      {props.subtitle ?? 'Discover products tailored to your taste.'}
                    </p>
                    <div className="mt-6">
                      <button
                        className="px-5 py-3 rounded-xl font-medium"
                        style={{ backgroundColor: accentColor, color: '#0b1220' }}
                      >
                        {props.cta ?? 'Shop now'}
                      </button>
                    </div>
                  </section>
                );
              }

              if (type === 'categoryGrid') {
                const items = Array.isArray(props.categories) ? props.categories : [
                  { name: 'New arrivals' },
                  { name: 'Best sellers' },
                  { name: 'Accessories' },
                  { name: 'Sale' },
                ];

                return (
                  <section key={idx}>
                    <h2 className="text-xl font-semibold">{props.title ?? 'Shop by category'}</h2>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {items.map((c: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl border p-4"
                          style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                        >
                          <div className="font-medium">{c?.name ?? 'Category'}</div>
                          <div className="text-sm opacity-70 mt-1">Explore</div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (type === 'featuredProducts') {
                const products = Array.isArray(props.products) ? props.products : [
                  { name: 'Featured product', price: '$29' },
                  { name: 'Featured product', price: '$39' },
                  { name: 'Featured product', price: '$49' },
                ];

                return (
                  <section key={idx}>
                    <h2 className="text-xl font-semibold">{props.title ?? 'Featured products'}</h2>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {products.map((p: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl border p-4"
                          style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                        >
                          <div className="h-28 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
                          <div className="mt-3 font-medium">{p?.name ?? 'Product'}</div>
                          <div className="text-sm opacity-70">{p?.price ?? '$0'}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (type === 'testimonials') {
                const quotes = Array.isArray(props.items) ? props.items : [
                  { quote: 'Fast delivery and great quality.', name: 'Customer' },
                  { quote: 'Love the selection!', name: 'Customer' },
                ];

                return (
                  <section key={idx}>
                    <h2 className="text-xl font-semibold">{props.title ?? 'What customers say'}</h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quotes.map((t: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl border p-5"
                          style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                        >
                          <p className="opacity-90">“{t?.quote ?? 'Great experience.'}”</p>
                          <div className="mt-3 text-sm opacity-70">— {t?.name ?? 'Customer'}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (type === 'newsletter') {
                return (
                  <section
                    key={idx}
                    className="rounded-2xl p-8"
                    style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                  >
                    <h2 className="text-xl font-semibold">{props.title ?? 'Get updates'}</h2>
                    <p className="opacity-70 mt-2">{props.subtitle ?? 'Subscribe for new drops and offers.'}</p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <input
                        className="flex-1 rounded-xl border px-4 py-3 bg-transparent"
                        style={{ borderColor: 'rgba(0,0,0,0.12)' }}
                        placeholder="Email address"
                      />
                      <button
                        className="px-5 py-3 rounded-xl font-medium"
                        style={{ backgroundColor: primaryColor, color: '#ffffff' }}
                      >
                        Subscribe
                      </button>
                    </div>
                  </section>
                );
              }

              if (type === 'footer') {
                return (
                  <footer
                    key={idx}
                    className="pt-10 mt-10 border-t text-sm opacity-70"
                    style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                  >
                    <div>© {new Date().getFullYear()} {props.brandName ?? subdomain}</div>
                  </footer>
                );
              }

              return null;
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h1 className="text-2xl font-semibold">Storefront is ready</h1>
            <p className="text-muted-foreground mt-3">No sections found in config.</p>
          </div>
        )}
      </div>
    </main>
  );
}
