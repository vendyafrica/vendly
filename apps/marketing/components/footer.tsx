import Link from "next/link";

const productLinks = [
  { title: "Features", href: "/#product" },
  { title: "Pricing", href: "/#pricing" },
  { title: "For Creators", href: "/#solutions" },
  { title: "For Stores", href: "/#solutions" },
]

const companyLinks = [
  { title: "About", href: "/#about" },
  { title: "Contact", href: "/#contact" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms of Service", href: "/terms" },
]

const followLinks = [
  { title: "Instagram", href: "https://instagram.com/vendlyafrica" },
  { title: "TikTok", href: "https://tiktok.com/@vendlyafrica" },
  { title: "WhatsApp", href: "https://wa.me/256780808992" },
]

const Footer = () => {
  return (
    <>
      {/* CTA Band */}
      <div className="bg-[#5B4BFF] py-20 px-6 text-center">
        <h2
          className="text-[clamp(26px,4vw,44px)] font-extrabold text-white leading-[1.1] mb-4"
          style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-1.5px' }}
        >
          Your followers are already interested.<br />
          Give them somewhere to buy.
        </h2>
        <p className="text-[16px] text-white/70 mb-10">
          Takes 3 minutes. No credit card. No tech skills required.
        </p>
        <Link
          href="https://duuka.store/onboarding"
          className="inline-flex items-center gap-2 text-[#5B4BFF] bg-white font-bold text-[15px] rounded-full px-9 py-4 hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-black/20"
        >
          Create your free store →
        </Link>
        <p className="mt-4 text-[12px] text-white/40">
          Join sellers already using Shopvendly to close more sales.
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A0A0F] px-6 pt-16 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand col */}
            <div className="col-span-2 md:col-span-1">
              <span
                className="text-[18px] font-bold text-white block mb-3"
                style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}
              >
                shop<span className="text-[#7B6EFF]">vendly</span>
              </span>
              <p className="text-[13px] text-white/40 leading-relaxed">
                Sell more from every post you share. Built for Instagram, TikTok,
                and WhatsApp sellers across Africa.
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="text-[10px] font-semibold tracking-[1px] uppercase text-white/30 mb-4">Product</div>
              <ul className="flex flex-col gap-2.5">
                {productLinks.map((l) => (
                  <li key={l.title}>
                    <Link href={l.href} className="text-[13px] text-white/50 hover:text-white/90 transition-colors">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="text-[10px] font-semibold tracking-[1px] uppercase text-white/30 mb-4">Company</div>
              <ul className="flex flex-col gap-2.5">
                {companyLinks.map((l) => (
                  <li key={l.title}>
                    <Link href={l.href} className="text-[13px] text-white/50 hover:text-white/90 transition-colors">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow */}
            <div>
              <div className="text-[10px] font-semibold tracking-[1px] uppercase text-white/30 mb-4">Follow</div>
              <ul className="flex flex-col gap-2.5">
                {followLinks.map((l) => (
                  <li key={l.title}>
                    <Link href={l.href} className="text-[13px] text-white/50 hover:text-white/90 transition-colors">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.07] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[12px] text-white/30">© 2026 Vendly. All rights reserved.</span>
            <span className="text-[12px] text-white/30">shopvendly.store</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
