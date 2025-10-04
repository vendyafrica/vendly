"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Container } from "@/app/components/container";
import { cn } from "@/lib/utils";
import CtaBand from "@/app/components/cta-band";
import { Sparkles, Store, Rocket, Shield, Plug, Users, ImageIcon, ArrowRight, Instagram, ShoppingBag } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.1, 0.25, 1], 
      delay: i * 0.1 
    },
  }),
};

const floatingAnimation = {
  initial: { opacity: 0, y: 20, rotate: 0 },
  animate: (i: number) => ({
    opacity: [0, 1, 1],
    y: [20, -10, 10, -10],
    rotate: [0, 2, -2, 2, 0],
    transition: {
      duration: 4 + i * 0.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
      delay: i * 0.3,
    },
  }),
};

export default function Home() {
  return (
    <>
      {/* Hero Section - Full Height 2-Column Layout */}
      <section className="relative min-h-screen flex items-center px-8 md:px-16 lg:px-24 pt-24" aria-labelledby="hero-title">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[60%_40%] lg:gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col gap-8 z-10"
            >
              {/* Eyebrow Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#8B0000] px-5 py-2 text-sm font-medium text-white shadow-lg"
              >
                <Sparkles className="h-4 w-4" />
                BEYOND THE FEED - Launch in 5 minutes
                <ArrowRight className="h-4 w-4" />
              </motion.div>

              {/* Stripe-Style Headline */}
              <h1
                id="hero-title"
                className="text-[clamp(3rem,8vw,7.5rem)] font-extrabold leading-[0.9] tracking-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="block text-white/80"
                >
                  Your store
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="block text-white/80"
                >
                  beyond
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="block text-white/80"
                >
                  the feed
                </motion.span>
              </h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-xl text-2xl leading-relaxed text-white/90 font-normal"
              >
                Turn Instagram DMs into a real online store. Get paid, deliver orders, and get discovered—all in 5 minutes.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Button
                  size="lg"
                  className="group rounded-full bg-black px-10 py-6 text-base font-semibold text-white shadow-xl transition-all hover:bg-black/90 hover:scale-105"
                >
                  Start for free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-white/30 bg-transparent px-10 py-6 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50"
                >
                  Watch demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Instagram to Storefront Animation */}
            <div className="relative h-[600px] lg:h-[700px] order-first lg:order-last">
              {/* Stage 1: Floating Instagram Cards */}
              <motion.div
                custom={0}
                initial="initial"
                animate="animate"
                variants={floatingAnimation}
                className="absolute top-[10%] left-[10%] w-48 h-64 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl p-4"
              >
                <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-white/30 rounded w-3/4" />
                  <div className="h-3 bg-white/20 rounded w-1/2" />
                </div>
              </motion.div>

              <motion.div
                custom={1}
                initial="initial"
                animate="animate"
                variants={floatingAnimation}
                className="absolute top-[30%] right-[5%] w-44 h-56 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl p-4"
              >
                <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-orange-400 to-red-400 mb-3" />
                <div className="space-y-2">
                  <div className="h-2 bg-white/30 rounded w-2/3" />
                  <div className="h-2 bg-white/20 rounded w-1/2" />
                </div>
              </motion.div>

              <motion.div
                custom={2}
                initial="initial"
                animate="animate"
                variants={floatingAnimation}
                className="absolute bottom-[20%] left-[5%] w-40 h-52 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl p-3"
              >
                <div className="w-full h-28 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 mb-2" />
                <div className="space-y-2">
                  <div className="h-2 bg-white/30 rounded w-3/4" />
                  <div className="h-2 bg-white/20 rounded w-1/2" />
                </div>
              </motion.div>

              {/* Center Storefront UI */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl p-6 z-10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#7042D2]" />
                    <span className="font-bold text-lg">Vendly Store</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3 text-sm text-gray-500">
                    Search products...
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-[#7042D2] text-white text-xs rounded-full">All</div>
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Fashion</div>
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Beauty</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 aspect-square" />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[#7042D2] text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30"
                >
                  Checkout with M-Pesa
                </motion.button>
              </motion.div>

              {/* Floating UI Elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-[5%] right-[20%] w-32 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
              />
              
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-[10%] right-[15%] w-40 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sell smarter section */}
      <section
        id="features"
        className="py-24 sm:py-32 bg-white"
        aria-labelledby="features-title"
      >
        <Container>
          <motion.h2
            id="features-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mb-12 text-center text-3xl font-bold sm:text-4xl"
          >
            Sell smarter online
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Left large card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="md:col-span-2"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-[var(--brand-purple)]" />
                    Transform followers into paying customers
                  </CardTitle>
                  <CardDescription>
                    Create a fast, conversion‑ready storefront that feels native
                    to your audience.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video w-full rounded-2xl border bg-secondary" />
                </CardContent>
              </Card>
            </motion.div>

            {/* Right stack */}
            <div className="grid gap-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={1}
              >
                <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plug className="h-5 w-5 text-[var(--brand-purple)]" />
                      Plug into your social channels
                    </CardTitle>
                    <CardDescription>
                      Link in bio, product tags, and checkout designed for
                      socials.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[16/10] w-full rounded-2xl border bg-secondary" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={2}
              >
                <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[var(--brand-purple)]" />
                      Manage customers and orders
                    </CardTitle>
                    <CardDescription>
                      Built‑in CRM, order tracking and notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[16/10] w-full rounded-2xl border bg-secondary" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Four-step timeline */}
      <section id="how" className="py-24 sm:py-32 bg-gray-50" aria-labelledby="how-title">
        <Container className="grid gap-10 md:grid-cols-[1fr,auto,1fr]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="md:col-span-3 text-center"
          >
            <h2 id="how-title" className="text-3xl font-bold sm:text-4xl">
              Launch your online store in four simple steps
            </h2>
          </motion.div>

          <ol className="relative mx-auto w-full max-w-3xl space-y-10">
            {[
              {
                title: "Create account",
                desc: "Sign up with just your email to get started.",
                icon: <Shield className="h-4 w-4" />,
              },
              {
                title: "Design your storefront",
                desc: "Pick a theme and add your products in minutes.",
                icon: <Sparkles className="h-4 w-4" />,
              },
              {
                title: "Connect socials",
                desc: "Link Instagram, TikTok, X and more to drive traffic.",
                icon: <Plug className="h-4 w-4" />,
              },
              {
                title: "Go live",
                desc: "Share your link and start selling securely.",
                icon: <Rocket className="h-4 w-4" />,
              },
            ].map((step, i) => (
              <motion.li
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative pl-8"
              >
                <span className="absolute left-0 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border bg-background">
                  {step.icon}
                </span>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Showcase area */}
      <section
        id="showcase"
        className="py-24 sm:py-32 bg-white"
        aria-labelledby="showcase-title"
      >
        <Container className="space-y-8">
          <motion.h2
            id="showcase-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl font-bold sm:text-4xl"
          >
            Claim your digital storefront now
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="rounded-3xl border bg-card"
          >
            <div className="aspect-video w-full rounded-3xl border bg-secondary" />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="flex gap-4"
          >
            <Button variant="brand" className="rounded-full px-8 py-3 text-base font-bold shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:shadow-purple-500/30">
              Start free
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-3 text-base font-semibold border-2 hover:bg-white/50 transition-all">
              View templates
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* CTA band */}
      <CtaBand />
    </>
  );
}
