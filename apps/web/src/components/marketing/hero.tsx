"use client"

import Image from "next/image"
import Link from "next/link"
import { Anton } from "next/font/google"
import { HugeiconsIcon } from "@hugeicons/react"
import { MetaIcon, TiktokIcon, InstagramIcon } from "@hugeicons/core-free-icons"

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" })

export function Hero() {
  return (
    <section className="relative min-h-[88vh] bg-black text-white overflow-hidden flex items-center" id="product">
      <Image
        src="https://mplsrodasp.ufs.sh/f/9yFN4ZxbAeCYGCqT4P0y6qtUZFGzTeojCd8gH4bMhVIBcL5m"
        alt="Seller relaxing while business runs"
        fill
        className="object-cover object-center opacity-70"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#121214] via-[#121214]/80 to-[#121214]/35" />

      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-10 py-16 md:py-28">
        <div className="max-w-2xl space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-white/80">Automate Instagram, TikTok, WhatsApp</span>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h1
              className={`${anton.className} text-[clamp(30px,5vw,58px)] leading-[1.05] font-black tracking-tight`}
            >
              Make the most out of every customer conversation.
            </h1>
            <p className="text-base md:text-xl text-white/80 max-w-xl">
              Sell more, engage better, and grow your audience with automated checkouts, instant confirmations, and human support when it matters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <Link
              href="/c"
              className="inline-flex items-center justify-center rounded-full bg-[#FF2FB2] hover:bg-[#ff4bc2] text-white font-extrabold tracking-[0.16em] uppercase px-6 py-3 text-sm shadow-lg shadow-[#FF2FB2]/30 transition-transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <span className="text-sm text-white/60">Try it 14 days free.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2 md:pt-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={MetaIcon} size={22} />
              <span className="font-semibold">Meta Business</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={InstagramIcon} size={22} />
              <span className="font-semibold">Instagram Shopping</span>
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
