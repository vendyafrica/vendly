"use client";

import { ShoppingBag, Blocks, Factory, PackageCheck } from "lucide-react";
import AnimatedBeamMultipleOutputDemo from "@/registry/example/animated-beam-multiple-outputs";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const features = [
  {
    Icon: Blocks,
    name: "Instant Setup & Sync",
    description:
      "Connect your socials, and we sync your products with your storefront in minutes. No migration, no plugins.",
    className: "col-span-12",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute -right-10 -top-10 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: PackageCheck,
    name: "Payments and delivery built in for you",
    description:
      "No more back‑and‑forth. Buyers pay, pick delivery, you just confirm and dispatch.",
    className: "col-span-6",
    background: (
      <DotLottieReact
        src="https://lottie.host/d0468ba9-bd89-4362-8d4c-f8e6a21b358b/jxmK7PuIsU.lottie"
        loop
        autoplay
        speed={0.5}
        style={{ width: "100%", height: "100%" }}
      />
    ),
  },
  {
    Icon: ShoppingBag,
    name: "Convert followers to customers",
    description:
      "Share your vendly store across all social media. Buyers can follow your store, save favorites, and re‑order in one tap.",
    className: "col-span-6",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-60 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] transition-opacity duration-300 ease-out group-hover:opacity-80">
        <DotLottieReact
          src="https://lottie.host/4b4415f8-555d-46c2-95ff-ca5f8cbb8221/pprvv7gvLr.lottie"
          loop
          autoplay
          speed={0.5}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    ),
  },
  {
    Icon: Factory,
    name: "Business tools at the tip of your fingers",
    description:
      "One dashboard to do it all. Manage orders, inventory, customers, and payouts without leaving your workflow.",
    className: "col-span-12",
    background: (
      <div className="absolute inset-x-0 bottom-0 mx-auto h-full w-full opacity-50 [mask-image:linear-gradient(to_bottom,transparent_30%,#000_90%)] transition-all duration-300 ease-out group-hover:opacity-80 group-hover:scale-105">
        <DotLottieReact
          src="https://lottie.host/b991dfc1-ca24-478f-aa19-d96efadaa14e/WCseEhxinW.lottie"
          loop
          autoplay
          speed={0.5}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    ),
  },
];

export default function Features() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Features
          </p>
          <h2 className="mb-6 text-5xl font-bold text-gray-900 sm:text-6xl leading-tight">
            Everything You Need to Sell Effortlessly
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 leading-relaxed">
            Vendly automates your entire selling flow — from posting to
            payments.
          </p>
        </div>
        <BentoGrid className="mx-auto max-w-6xl gap-6">
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
