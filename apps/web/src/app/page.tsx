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
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.08 },
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
      <section className="section-y" aria-labelledby="hero-title">
        <Container className="relative overflow-hidden text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto flex max-w-4xl flex-col items-center gap-6"
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground/80 shadow-sm shadow-black/5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand-purple)]" />
              Beyond the feed
            </p>
            <h1
              id="hero-title"
              className="text-balance text-[clamp(2.75rem,5vw,4.75rem)] font-semibold leading-[1.08] text-foreground"
            >
              Turn your social media store into reality
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Vendly helps social sellers transform Instagram and WhatsApp stores into polished online storefronts. Get a complete setup with payments and delivery in minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="brand" className="rounded-full px-7 py-3 text-sm font-semibold shadow-sm shadow-black/10">
                Get started
              </Button>
              <Button variant="outline" className="rounded-full px-7 py-3 text-sm font-semibold">
                Learn more
              </Button>
            </div>
          </motion.div>

          <div className="relative mt-16 flex w-full justify-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/70 bg-white/80 p-10 shadow-2xl shadow-black/10 backdrop-blur-lg"
            >
              <div className="flex flex-col items-start gap-6 text-left sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground/70">
                    Preview Storefront
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Everything you need to launch in minutes
                  </h2>
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Customize your layout, connect socials, and manage orders from one beautiful dashboard.
                  </p>
                </div>
                <Button variant="brand" className="rounded-full px-6 py-2 text-sm font-semibold shadow-sm shadow-black/10">
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
                    "absolute rounded-3xl border border-white/60 bg-white/80 shadow-xl shadow-black/10 backdrop-blur-md",
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
        className="section-y"
        aria-labelledby="features-title"
      >
        <Container>
          <motion.h2
            id="features-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mb-8 text-center text-2xl font-semibold sm:text-3xl"
          >
            Sell smarter online
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Left large card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="md:col-span-2"
            >
              <Card className="h-full">
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
                  <div className="aspect-video w-full rounded-md border bg-secondary" />
                </CardContent>
              </Card>
            </motion.div>

            {/* Right stack */}
            <div className="grid gap-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={1}
              >
                <Card>
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
                    <div className="aspect-[16/10] w-full rounded-md border bg-secondary" />
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
                <Card>
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
                    <div className="aspect-[16/10] w-full rounded-md border bg-secondary" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Four-step timeline */}
      <section id="how" className="section-y" aria-labelledby="how-title">
        <Container className="grid gap-10 md:grid-cols-[1fr,auto,1fr]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="md:col-span-3 text-center"
          >
            <h2 id="how-title" className="text-2xl font-semibold sm:text-3xl">
              Launch your online store in four simple steps
            </h2>
          </motion.div>

          <ol className="relative mx-auto w-full max-w-3xl space-y-8">
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
        className="section-y"
        aria-labelledby="showcase-title"
      >
        <Container className="space-y-4">
          <motion.h2
            id="showcase-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-2xl font-semibold sm:text-3xl"
          >
            Claim your digital storefront now
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="rounded-xl border bg-card"
          >
            <div className="aspect-video w-full rounded-xl border bg-secondary" />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="flex gap-3"
          >
            <Button variant="brand">Start free</Button>
            <Button variant="outline">View templates</Button>
          </motion.div>
        </Container>
      </section>

      {/* CTA band */}
      <CtaBand />
    </>
  );
}
