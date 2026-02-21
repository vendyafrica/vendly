import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "Your first 10 orders",
    description: "Get your store live, share your links, and prove the product works for your business — completely free.",
    features: [
      "Full storefront with your own link",
      "Instagram product import",
      "Mobile Money checkout",
      "WhatsApp order notifications",
      "Up to 10 completed orders",
    ],
    featured: false,
    badge: null,
    cta: "Create free store",
    ctaHref: "https://duuka.store/onboarding",
  },
  {
    name: "Growth",
    price: "4%",
    period: "per completed sale · no monthly fee",
    description: "You only pay when you make a sale. Everything you need to run and grow a serious social commerce business.",
    features: [
      "Everything in Starter",
      "Unlimited orders",
      "Creator referral tracking",
      "Commission automation",
      "Sales analytics dashboard",
      "Customer contact history",
    ],
    featured: true,
    badge: "Most popular",
    cta: "Get started free →",
    ctaHref: "https://duuka.store/onboarding",
  },
  {
    name: "Scale",
    price: "2%",
    period: "per completed sale · flat monthly fee",
    description: "Lower per-sale rate for sellers doing serious volume. Talk to us when you're ready to scale.",
    features: [
      "Everything in Growth",
      "Reduced transaction fee",
      "Priority support",
      "Custom store domain",
      "Bulk product management",
      "Dedicated account manager",
    ],
    featured: false,
    badge: null,
    cta: "Talk to us",
    ctaHref: "mailto:hello@vendlyafrica.store",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#F5F5F7] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">

        {/* Header */}
        <div className="mb-16 max-w-xl">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-[#5B4BFF] mb-5">Pricing</div>
          <h2
            className="text-[clamp(32px,5vw,52px)] font-extrabold text-[#0A0A0F] leading-[1.06] mb-4"
            style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-1.5px' }}
          >
            We make money<br />
            <span className="text-[#8A8A9E]">when you do.</span>
          </h2>
          <p className="text-[16px] text-[#3D3D4E] leading-relaxed">
            No monthly fees until you're ready. We take a small cut of completed
            sales only — so our incentives are perfectly aligned with yours.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 ${plan.featured
                  ? 'bg-[#0A0A0F] shadow-2xl shadow-black/20 md:scale-[1.03] md:-mt-2'
                  : 'bg-white border border-[#EBEBF0] shadow-sm hover:shadow-md'
                }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#5B4BFF] text-white text-[11px] font-semibold rounded-full px-4 py-1 whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <div className={`text-[11px] font-semibold tracking-[1.5px] uppercase mb-3 ${plan.featured ? 'text-white/50' : 'text-[#8A8A9E]'}`}>
                {plan.name}
              </div>

              {/* Price */}
              <div className="mb-1">
                <span
                  className={`text-[44px] font-extrabold leading-none tracking-tight ${plan.featured ? 'text-white' : 'text-[#0A0A0F]'}`}
                  style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}
                >
                  {plan.name === 'Starter' ? plan.price : (
                    <><sup className="text-[22px] align-super">%</sup>{plan.price.replace('%', '')}</>
                  )}
                </span>
              </div>
              <div className={`text-[13px] mb-6 pb-6 border-b ${plan.featured ? 'text-white/40 border-white/10' : 'text-[#8A8A9E] border-[#EBEBF0]'}`}>
                {plan.period}
              </div>

              {/* Description */}
              <p className={`text-[14px] leading-relaxed mb-6 ${plan.featured ? 'text-white/55' : 'text-[#3D3D4E]'}`}>
                {plan.description}
              </p>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2.5 text-[13px] ${plan.featured ? 'text-white/70' : 'text-[#3D3D4E]'}`}>
                    <span className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold ${plan.featured ? 'bg-[#5B4BFF]/40 text-white' : 'bg-[#F0EEFF] text-[#5B4BFF]'}`}>
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`block w-full text-center text-[14px] font-semibold rounded-full py-3.5 transition-all duration-200 ${plan.featured
                    ? 'bg-[#5B4BFF] text-white hover:bg-[#7B6EFF] shadow-lg shadow-[#5B4BFF]/40'
                    : 'border-[1.5px] border-[#EBEBF0] text-[#0A0A0F] hover:border-[#5B4BFF] hover:text-[#5B4BFF]'
                  }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
