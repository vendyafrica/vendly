import Link from "next/link";
import { Anton } from "next/font/google";

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" });

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
      <div className="bg-[#F8F7F4] py-14 md:py-20 px-5 text-center">
        <h2
          className={`${anton.className} text-[clamp(26px,4vw,44px)] font-extrabold text-[#0A0A0F] leading-[1.1] mb-4`}
          style={{ letterSpacing: '-1.5px' }}
        >
          Your followers are already interested.<br />
          Give them somewhere to buy.
        </h2>
        <p className="text-[14px] text-[#3D3D4E] mb-10">
          Takes 3 minutes.
        </p>
        <Link
          href="https://duuka.store/onboarding"
          className="inline-flex items-center gap-2 bg-[#FF2FB2] hover:bg-[#ff4bc2] text-white font-bold text-[15px] rounded-full px-9 py-4 hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-[#FF6FA5]/30"
        >
          Create your free store →
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-[#F1F0EC] px-5 pt-10 md:pt-14 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-12">
            {/* Brand col */}
            <div className="col-span-2 md:col-span-1">
              <span
                className="text-[18px] font-bold text-[#0A0A0F] block mb-3"
                style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}
              >
                shop<span className="text-[#7B6EFF]">vendly</span>
              </span>
              <p className="text-[13px] text-[#3D3D4E] leading-relaxed">
                Sell more from every post you share. Built for Instagram, TikTok,
                and WhatsApp sellers across Africa.
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#6C6C7A] mb-4">Product</div>
              <ul className="flex flex-col gap-2.5">
                {productLinks.map((l) => (
                  <li key={l.title}>
                    <Link href={l.href} className="text-[13px] text-[#3D3D4E] hover:text-[#F2C94C] transition-colors">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#6C6C7A] mb-4">Company</div>
              <ul className="flex flex-col gap-2.5">
                {companyLinks.map((l) => (
                  <li key={l.title}>
                    <Link href={l.href} className="text-[13px] text-[#3D3D4E] hover:text-[#F2C94C] transition-colors">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow */}
            <div>
              <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#6C6C7A] mb-4">Follow</div>
              <ul className="flex flex-col gap-2.5">
                {followLinks.map((l) => (
                  <li key={l.title}>
                    <Link href={l.href} className="text-[13px] text-[#3D3D4E] hover:text-[#F2C94C] transition-colors">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#E2E0DA] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[12px] text-[#6C6C7A]"> 2026 Vendly. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
