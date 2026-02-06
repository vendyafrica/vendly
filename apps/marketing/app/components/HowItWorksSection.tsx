import Link from "next/link";

const steps = [
    {
        number: "01",
        title: "Connect Your Social",
        description: "Sign up and link your Instagram, TikTok, or WhatsApp Business. We'll help you import your products.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
        ),
    },
    {
        number: "02",
        title: "Create Your Store",
        description: "Your products become a professional storefront in minutes. Add descriptions, prices, and variants.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
    },
    {
        number: "03",
        title: "Share Your Link",
        description: "Drop your Vendly link in your bio, stories, or DMs. Buyers click and land on your checkout.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
        ),
    },
    {
        number: "04",
        title: "Get Paid Instantly",
        description: "Buyers pay securely with mobile money or cards. You get instant confirmation — no screenshots needed.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        number: "05",
        title: "We Handle Delivery",
        description: "Vendly coordinates pickup with local couriers. Track everything from your dashboard.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
        ),
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 bg-cream relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-y-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="badge mb-4">Simple Process</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
                        From Social Post to{" "}
                        <span className="text-gradient">Successful Sale</span>
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Keep using social media for marketing. Vendly handles everything that happens
                        when a buyer says &quot;I want this.&quot;
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.number}
                                className="relative group"
                            >
                                {/* Step card */}
                                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 h-full border border-gray-100 group-hover:border-accent/20">
                                    {/* Step number */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-4xl font-bold text-accent/20">{step.number}</span>
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                            {step.icon}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-primary mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Arrow connector (desktop) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-24 -right-2 transform translate-x-1/2 z-10">
                                        <svg className="w-4 h-4 text-accent/40" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link href="/signup" className="btn btn-primary text-lg px-10 py-4">
                        Start Your Store Now
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <p className="text-gray-500 text-sm mt-4">
                        Free to start • No credit card required
                    </p>
                </div>
            </div>
        </section>
    );
}
