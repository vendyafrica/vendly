"use client"

const steps = [
    {
        num: "01",
        icon: "",
        title: "Post it.",
        body: "Add your Shopvendly link to your bio or drop it in the caption. Every product gets its own link. Share the dress. Share the skincare set. Share anything."
    },
    {
        num: "02",
        icon: "🛍️",
        title: "They click. They buy.",
        body: "Your buyer lands on a clean product page. No account. No password. Name, phone, address, Mobile Money. Under 90 seconds on any phone."
    },
    {
        num: "03",
        icon: "💬",
        title: "You get the ping.",
        body: "The moment an order lands, your WhatsApp gets everything — buyer name, number, address, and what they ordered. No inbox-checking. No missed messages."
    },
    {
        num: "04",
        icon: "📊",
        title: "Creators get credit.",
        body: "Give any creator a link with their tag. Every sale they drive shows up in your dashboard — automatically tracked, commission calculated. They earn. You scale."
    }
]

export function Features() {
    return (
        <section id="product" className="bg-[#0A0A0F] py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6 md:px-8">

                {/* Header */}
                <div className="mb-16">
                    <div className="text-[11px] font-semibold tracking-[2px] uppercase text-[#7B6EFF] mb-5">
                        How it works
                    </div>
                    <h2
                        className="text-[clamp(32px,5vw,52px)] font-extrabold text-white leading-[1.06]"
                        style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-1.5px' }}
                    >
                        From post to paid.<br />
                        <span className="text-white/30">In four steps.</span>
                    </h2>
                    <p className="mt-5 text-[16px] text-white/50 max-w-lg leading-relaxed">
                        No DMs. No back-and-forth. No dropped orders. Your content does
                        the selling — Shopvendly handles everything that comes after.
                    </p>
                </div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
                    {steps.map((step) => (
                        <div
                            key={step.num}
                            className="bg-[#0A0A0F] hover:bg-white/[0.04] transition-colors p-8 flex flex-col gap-5"
                        >
                            <div
                                className="text-[11px] font-bold tracking-widest text-[#7B6EFF]"
                                style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}
                            >
                                {step.num}
                            </div>
                            <span className="text-3xl">{step.icon}</span>
                            <div
                                className="text-[17px] font-bold text-white leading-snug"
                                style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}
                            >
                                {step.title}
                            </div>
                            <p className="text-[13px] text-white/45 leading-relaxed">
                                {step.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}