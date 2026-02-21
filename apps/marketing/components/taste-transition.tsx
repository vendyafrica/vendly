"use client"

const problems = [
    {
        num: "01",
        text: "Your DMs are not an order management system. They're a waiting room where buyers lose patience and leave."
    },
    {
        num: "02",
        text: "Buyers who can't buy in the moment don't come back. Every missed message is a missed sale."
    },
    {
        num: "03",
        text: "Marketplaces steal your audience & margins. You built the following — you should keep the revenue."
    }
]

export function TasteTransition() {
    return (
        <section
            className="relative bg-[#0A0A0F] overflow-hidden py-24 md:py-36"
        >
            {/* Subtle purple radial glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(91,75,255,0.12) 0%, transparent 70%)'
            }} />

            <div className="relative mx-auto max-w-6xl px-6 md:px-8">
                {/* Headline */}
                <div className="mb-16 md:mb-20">
                    <div className="text-[11px] font-semibold tracking-[2px] uppercase text-[#7B6EFF] mb-5">
                        The problem
                    </div>
                    <h2
                        className="text-[clamp(36px,6vw,64px)] font-extrabold leading-[1.04] text-white"
                        style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-2px' }}
                    >
                        Stop selling<br />
                        <span className="text-white/30">from your inbox.</span>
                    </h2>
                </div>

                {/* Problem cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/6 rounded-2xl overflow-hidden">
                    {problems.map((p) => (
                        <div
                            key={p.num}
                            className="bg-[#0A0A0F] hover:bg-white/4 transition-colors p-8 md:p-10 flex flex-col gap-5"
                        >
                            <div
                                className="text-[12px] font-bold text-[#5B4BFF] tracking-wider"
                                style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}
                            >
                                {p.num}
                            </div>
                            <div className="h-px w-full bg-white/10" />
                            <p className="text-[16px] text-white/70 leading-relaxed">
                                {p.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Closing line */}
                <div className="mt-16 max-w-2xl">
                    <p className="text-[17px] text-white/45 leading-relaxed">
                        Sellers on Shopvendly stop losing orders they didn't even know they were losing.
                        It's time for a storefront that actually works with how you sell.
                    </p>
                </div>
            </div>
        </section>
    )
}
