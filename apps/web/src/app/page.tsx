"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/app/components/container";
import CtaBand from "@/app/components/cta-band";
import { Sparkles, Store, Rocket, Shield, Plug, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.08 },
  }),
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section-y" aria-labelledby="hero-title">
        <Container className="text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto max-w-3xl"
          >
            <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs/6 text-muted-foreground glass">
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand-purple)]" />
              Your store beyond the feed
            </p>
            <h1
              id="hero-title"
              className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl gradient-text"
            >
              Turn your social media store into reality
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground">
              Swiftly transform followers into customers with a beautiful,
              mobile‑first storefront that plugs into your social presence.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="brand" className="px-6">Start free</Button>
              <Button variant="outline">Book demo</Button>
            </div>
          </motion.div>

          {/* Decorative image placeholders like the wireframe */}
          <div className="pointer-events-none mt-10 grid grid-cols-3 gap-4 opacity-60 sm:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-12 rounded-md border bg-secondary" />
            ))}
          </div>
        </Container>
      </section>

      {/* Sell smarter section */}
      <section id="features" className="section-y" aria-labelledby="features-title">
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
                    Create a fast, conversion‑ready storefront that feels native to your audience.
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
                      Link in bio, product tags, and checkout designed for socials.
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
      <section id="showcase" className="section-y" aria-labelledby="showcase-title">
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
