import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative min-h-screen pt-28 pb-20 overflow-hidden bg-gradient-hero">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream-dark/50 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Copy */}
                    <div className="max-w-2xl animate-fade-in-up">
                        {/* Social proof badge */}
                        <div className="badge mb-6 animate-fade-in">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span>Built for African Creators & Sellers</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
                            Turn Your{" "}
                            <span className="text-gradient">Social Audience</span>{" "}
                            Into a Real Business
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                            Stop chasing DMs and screenshots. Vendly gives you a professional storefront,
                            built-in payments, and delivery coordination — so you can scale from side hustle
                            to real brand.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <Link href="/signup" className="btn btn-primary text-lg px-8 py-4">
                                Start Selling Free
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link href="#how-it-works" className="btn btn-secondary text-lg px-8 py-4">
                                See How It Works
                            </Link>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Free to start</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>No coding required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Launch in minutes</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Hero Visual */}
                    <div className="relative lg:pl-8 animate-fade-in-up delay-200">
                        {/* Main phone mockup */}
                        <div className="relative mx-auto max-w-sm">
                            {/* Phone frame */}
                            <div className="relative bg-primary rounded-[3rem] p-3 shadow-2xl animate-float">
                                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                                    {/* Phone notch */}
                                    <div className="h-8 bg-white flex items-center justify-center">
                                        <div className="w-20 h-6 bg-primary rounded-full" />
                                    </div>

                                    {/* Phone content - Store mockup */}
                                    <div className="p-4 space-y-4 min-h-[480px]">
                                        {/* Store header */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                                                <span className="text-accent font-bold">JF</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-primary text-sm">Jane&apos;s Fashion</h4>
                                                <p className="text-xs text-gray-400">@janesfashion • 2.4k followers</p>
                                            </div>
                                        </div>

                                        {/* Product grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { name: "African Print Dress", price: "UGX 85,000", color: "bg-orange-100" },
                                                { name: "Beaded Necklace", price: "UGX 35,000", color: "bg-pink-100" },
                                                { name: "Handwoven Bag", price: "UGX 65,000", color: "bg-yellow-100" },
                                                { name: "Ankara Headwrap", price: "UGX 25,000", color: "bg-purple-100" },
                                            ].map((product, i) => (
                                                <div key={i} className="bg-gray-50 rounded-xl p-3">
                                                    <div className={`${product.color} rounded-lg h-20 mb-2`} />
                                                    <p className="text-xs font-medium text-primary truncate">{product.name}</p>
                                                    <p className="text-xs text-accent font-bold">{product.price}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Cart button */}
                                        <button className="w-full bg-accent text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            View Cart (2)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 animate-float delay-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">New Order</p>
                                        <p className="text-sm font-bold text-primary">UGX 120,000</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 animate-float delay-500">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Customers</p>
                                        <p className="text-sm font-bold text-primary">+48 this week</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
