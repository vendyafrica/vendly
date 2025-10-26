"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { motion, AnimatePresence } from "framer-motion";
import { joinWaitlist } from "@/lib/api";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim() || !storeName.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await joinWaitlist({ email, phone, storeName });
      setSubmitted(true);

      if (!data.ok) {
        throw new Error(data.error || "Failed to join waitlist");
      }
      setSubmitted(true);
      setEmail("");
      setPhone("");
      setStoreName("");
      setTimeout(() => setSubmitted(false), 3500);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      console.error("Waitlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/60 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          Early Access Now Open
        </div>

        {/* Heading */}
        <h1 className="mt-10 text-4xl sm:text-6xl font-geist font-medium tracking-tight text-foreground leading-tight">
          Reserve your <span className="text-primary">Vendly</span> store today
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Join the waitlist to claim your unique storefront and get early access
          to premium tools for creators and sellers.
        </p>

        {/* Waitlist Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 w-full max-w-lg space-y-6 text-left"
        >
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-12 w-full rounded-xl bg-background/80 px-4 text-base"
              required
            />
            <FieldDescription>
              We'll send your early access invite here
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 (0700) 000-0000"
              className="h-12 w-full rounded-xl bg-background/80 px-4 text-base"
              required
            />
            <FieldDescription>
              For order notifications and support
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="storeName">Store Name</FieldLabel>
            <Input
              id="storeName"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="MyAwesomeStore"
              className="h-12 w-full rounded-xl bg-background/80 px-4 text-base"
              required
            />
            <FieldDescription>
              Reserve your unique Vendly storefront URL
            </FieldDescription>
          </Field>

          <Button
            type="submit"
            disabled={submitted}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary font-medium transition-all text-base mt-8 cursor-pointer"
          >
            {submitted ? "Reserved ✓" : "Reserve Your Store"}
          </Button>
        </form>

        {/* Confirmation Message */}
        <AnimatePresence>
          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-5 text-sm text-green-600"
            >
              You're on the list! We'll notify you when Vendly stores go live.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
