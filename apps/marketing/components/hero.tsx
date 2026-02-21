"use client"

import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { MetaIcon, TiktokIcon, InstagramIcon } from "@hugeicons/core-free-icons"

export function Hero() {
  return (
    <section className="relative min-h-[88vh] bg-black text-white overflow-hidden flex items-center" id="product">
      <Image
        src="/hero-1-vendly.jpg"
        alt="Seller relaxing while business runs"
        fill
        className="object-cover object-center opacity-70"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/65 to-black/35" />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/80">Automate Instagram, TikTok, WhatsApp</span>
          </div>

          <div className="space-y-4">
            <h1
              className="text-[clamp(34px,5vw,58px)] leading-[1.05] font-black tracking-tight"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
            >
              Make the most out of every customer conversation.
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl">
              Sell more, engage better, and grow your audience with automated checkouts, instant confirmations, and human support when it matters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="https://duuka.store/onboarding"
              className="inline-flex items-center justify-center rounded-full bg-[#FF2FB2] hover:bg-[#ff4bc2] text-white font-extrabold tracking-[0.16em] uppercase px-7 py-3 text-sm shadow-lg shadow-[#FF2FB2]/30 transition-transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <Link
              href="https://duuka.store/login"
              className="inline-flex items-center justify-center rounded-full border border-white/40 hover:border-white text-white font-semibold px-6 py-3 text-sm backdrop-blur transition-colors"
            >
              Sign in
            </Link>
            <span className="text-sm text-white/60">Free to start. No credit card.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={MetaIcon} size={22} />
              <span className="font-semibold">Meta Business Partner</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={InstagramIcon} size={22} />
              <span className="font-semibold">Instagram Commerce</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={TiktokIcon} size={22} />
              <span className="font-semibold">TikTok Marketing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
