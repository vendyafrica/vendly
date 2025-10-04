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
import { Sparkles, Store, Rocket, Shield, Plug, Users, ImageIcon } from "lucide-react";

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

const floatingPlaceholders = [
  { className: "hidden lg:block top-[-6rem] left-[6%]", size: "h-28 w-28", delay: 0.3 },
  { className: "top-[-4rem] right-[8%]", size: "h-24 w-24 sm:h-28 sm:w-28", delay: 0.6 },
  { className: "bottom-[-6rem] left-[10%]", size: "h-24 w-24 sm:h-28 sm:w-28", delay: 0.9 },
  { className: "bottom-[-6rem] right-[6%] hidden sm:block", size: "h-24 w-24", delay: 1.2 },
  { className: "top-[20%] left-[18%] hidden md:block", size: "h-16 w-16", delay: 1.5 },
  { className: "top-[38%] right-[18%] hidden md:block", size: "h-20 w-20", delay: 1.8 },
] as const;

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 sm:py-32 lg:py-40" aria-labelledby="hero-title">
        <Container className="relative overflow-hidden text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto flex max-w-5xl flex-col items-center gap-8"
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-[0.7rem] font-bold uppercase tracking-[0.32em] text-muted-foreground/70 shadow-md shadow-black/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[var(--brand-purple)]" />
              Beyond the feed
            </p>
            <h1
              id="hero-title"
              className="text-balance text-[clamp(3.5rem,8vw,6rem)] font-extrabold leading-[1.05] tracking-tight"
            >
              Turn your social media{" "}
              <span className="text-gray-400">store into reality</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground/80 sm:text-xl sm:leading-relaxed">
              Vendly helps social sellers transform Instagram and WhatsApp stores into polished online storefronts. Get a complete setup with payments and delivery in minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="brand" className="rounded-full px-10 py-4 text-base font-bold shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105">
                Get started
              </Button>
              <Button variant="outline" className="rounded-full px-10 py-4 text-base font-semibold border-2 hover:bg-white/50 transition-all">
                Learn more
              </Button>
            </div>
          </motion.div>

          <div className="relative mt-20 flex w-full justify-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="relative z-10 w-full max-w-3xl rounded-[40px] border border-white/60 bg-white/70 p-12 shadow-2xl shadow-black/5 backdrop-blur-xl"
            >
              <div className="flex flex-col items-start gap-6 text-left sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground/70">
                    Preview Storefront
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    Everything you need to launch in minutes
                  </h2>
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Customize your layout, connect socials, and manage orders from one beautiful dashboard.
                  </p>
                </div>
                <Button variant="brand" className="rounded-full px-8 py-3 text-base font-bold shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:shadow-purple-500/30">
                  View demo
                </Button>
              </div>
            </motion.div>

            <div className="pointer-events-none absolute inset-0 -z-10">
              {floatingPlaceholders.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 36 }}
                  animate={{
                    opacity: 0.9,
                    y: [-10, 12, -6],
                    rotate: [0, 6, -4, 0],
                  }}
                  transition={{
                    duration: 14 + index,
                    delay: item.delay,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  className={cn(
                    "absolute rounded-[32px] border border-white/50 bg-white/70 shadow-xl shadow-black/5 backdrop-blur-lg",
                    item.size,
                    item.className
                  )}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-7 w-7 text-muted-foreground/60" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Sell smarter section */}
      <section
        id="features"
        className="py-24 sm:py-32"
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
      <section id="how" className="py-24 sm:py-32" aria-labelledby="how-title">
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
        className="py-24 sm:py-32"
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
