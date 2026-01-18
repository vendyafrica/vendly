import Link from "next/link";

interface StorefrontHomeProps {
    params: Promise<{ storefront: string }>;
}

export default async function StorefrontHomePage({ params }: StorefrontHomeProps) {
    const { storefront } = await params;

    return (
        <main className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">{storefront}</h1>
                    <nav className="flex items-center gap-6">
                        <Link href={`/${storefront}/categories`} className="text-sm text-gray-600 hover:text-gray-900">
                            Categories
                        </Link>
                        <Link href={`/${storefront}/collections`} className="text-sm text-gray-600 hover:text-gray-900">
                            Collections
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-[60vh] bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to {storefront}</h2>
                    <p className="text-lg text-gray-300 mb-8">Discover our curated collection</p>
                    <Link
                        href={`/${storefront}/products`}
                        className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
                    >
                        Shop Now
                    </Link>
                </div>
            </section>

            {/* Products Section Placeholder */}
            <section className="container mx-auto px-4 py-16">
                <h3 className="text-2xl font-semibold mb-8">Featured Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">© {new Date().getFullYear()} {storefront}. Powered by Vendly.</p>
                </div>
            </footer>
        </main>
    );
}
