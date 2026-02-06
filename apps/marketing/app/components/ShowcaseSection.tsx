export function ShowcaseSection() {
    return (
        <section id="features" className="py-24 bg-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="badge mb-4">Why Vendly?</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
                        Everything You Need to{" "}
                        <span className="text-gradient">Sell Like a Pro</span>
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Stop juggling DMs, screenshots, and phone calls. Vendly handles payments, orders,
                        and delivery — so you can focus on creating and growing.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="card group hover:border-accent/20 border border-transparent">
                        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                            <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Instant Storefronts</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Create a professional online store in minutes. Auto-sync your Instagram and TikTok posts
                            into shoppable product listings.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="card group hover:border-accent/20 border border-transparent">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Seamless Payments</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Accept mobile money, cards, and bank transfers. Instant payment confirmation —
                            no more screenshot stress.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="card group hover:border-accent/20 border border-transparent">
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Order Management</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Centralized dashboard to track every order, customer, and inventory item.
                            Everything in one place, not scattered across apps.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="card group hover:border-accent/20 border border-transparent">
                        <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Delivery Coordination</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Integrated with local couriers and boda networks. Vendly handles pickup scheduling
                            and tracking — you just prepare the package.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="card group hover:border-accent/20 border border-transparent">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mb-6 group-hover:bg-yellow-200 transition-colors">
                            <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Marketplace Discovery</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Your products appear in the Vendly marketplace. Get discovered by new customers
                            beyond your social media reach.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="card group hover:border-accent/20 border border-transparent">
                        <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center mb-6 group-hover:bg-pink-200 transition-colors">
                            <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Own Your Customers</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Build lasting relationships with real customer data. No more depending on volatile
                            social algorithms for your business.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
