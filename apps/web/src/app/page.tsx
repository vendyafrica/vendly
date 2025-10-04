"use client";

import { useRef } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Container } from "@/app/components/container";
import CtaBand from "@/app/components/cta-band";
import { Sparkles, Store, Rocket, Shield, Plug, Users, ArrowRight } from "lucide-react";
import { useGsapAnimation } from "./components/use-gsap-animation";

export default function Home() {
  const scope = useRef<HTMLDivElement>(null);
  useGsapAnimation(scope);

  return (
    <div ref={scope}>
      {/* Hero Section - Full Height 2-Column Layout */}
      <section className="relative bg-white pt-28 pb-20 sm:pt-36 sm:pb-28" aria-labelledby="hero-title">
        <Container className="text-center">
          <div className="mx-auto max-w-2xl">
            <div className="hero-badge inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-gray-700">
              <Sparkles className="h-3.5 w-3.5" />
              Launch in 5 minutes
            </div>

            <h1
              id="hero-title"
              className="hero-title mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"
            >
              Turn your social media store into reality
            </h1>

            <p className="hero-subtitle mx-auto mt-5 max-w-xl text-base sm:text-lg text-gray-600">
              Vendly makes it simple to launch a storefront your audience can actually use.
              Get paid, fulfill orders, and grow—all in one place.
            </p>

            <div className="hero-cta mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold"
              >
                Start free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 px-8 py-6 text-base font-semibold"
              >
                Book demo
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Sell smarter section */}
      <section
        id="features"
        className="features-section py-24 sm:py-32 bg-white"
        aria-labelledby="features-title"
      >
        <Container>
          <h2
            id="features-title"
            className="mb-12 text-center text-3xl font-bold sm:text-4xl"
          >
            Sell smarter online
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Left large card */}
            <div className="feature-card md:col-span-2">
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
            </div>

            {/* Right stack */}
            <div className="grid gap-8">
              <div className="feature-card">
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
              </div>

              <div className="feature-card">
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
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Four-step timeline */}
      <section id="how" className="how-section py-24 sm:py-32 bg-gray-50" aria-labelledby="how-title">
        <Container className="grid gap-12 md:grid-cols-2">
          {/* Left: Titles list */}
          <div>
            <h2 id="how-title" className="text-3xl font-bold sm:text-4xl">
              Launch your online store in four simple steps
            </h2>

            <ol className="mt-8 space-y-6">
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
                <li key={i} className="timeline-step flex items-start gap-4">
                  <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Right: Descriptions with icons */}
          <div className="space-y-8">
            {[
              {
                title: "Create account",
                desc: "Sign up with just your email to get started.",
                icon: <Shield className="h-5 w-5" />,
              },
              {
                title: "Design your storefront",
                desc: "Pick a theme and add your products in minutes.",
                icon: <Sparkles className="h-5 w-5" />,
              },
              {
                title: "Connect socials",
                desc: "Link Instagram, TikTok, X and more to drive traffic.",
                icon: <Plug className="h-5 w-5" />,
              },
              {
                title: "Go live",
                desc: "Share your link and start selling securely.",
                icon: <Rocket className="h-5 w-5" />,
              },
            ].map((step, i) => (
              <div key={i} className="timeline-step flex items-start gap-4">
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
                  {step.icon}
                </span>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Showcase area */}
      <section
        id="showcase"
        className="py-24 sm:py-32 bg-white"
        aria-labelledby="showcase-title"
      >
        <Container className="space-y-8">
          <h2
            id="showcase-title"
            className="text-3xl font-bold sm:text-4xl"
          >
            Claim your digital storefront now
          </h2>
          <div className="rounded-3xl border bg-card">
            <div className="aspect-video w-full rounded-3xl border bg-secondary" />
          </div>
          <div className="flex gap-4">
            <Button variant="brand" className="rounded-full px-8 py-3 text-base font-bold shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:shadow-purple-500/30">
              Start free
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-3 text-base font-semibold border-2 hover:bg-white/50 transition-all">
              View templates
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <CtaBand />
    </div>
  );
}
