"use client";

import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { useState } from "react";
import { joinWaitlist } from "@/app/api/api";

export default function HeroSection({ id }: { id?: string }) {
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    setLoading(true);
    try {
      await joinWaitlist({ 
        storeName 
      });
      setSubmitted(true);
      setStoreName("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Waitlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-[#f8fafc] py-32 sm:py-40"
      id={id}
    >
      {/* Grid background with proper mask */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      {/* Subtle glow effects */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[700px] w-[1000px] rounded-full bg-primary/[0.08] blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 h-[600px] w-[700px] rounded-full bg-primary/[0.05] blur-[120px] -z-10 pointer-events-none" />

      <div className="mx-auto max-w-3xl px-6 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
          One <span className="text-primary">platform</span> to run your business
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Sell anywhere. Vendly gives you the tools to sell products anywhere,
          manage everything in one place, and grow your business faster.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md">
          <div className="flex gap-2">
            <Input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter your store name"
              className="flex-1"
              required
              disabled={loading || submitted}
            />
            <Button 
              type="submit"
              disabled={loading || submitted}
            >
              {loading ? "Joining..." : submitted ? "Joined" : "Join Waitlist"}
            </Button>
          </div>
          {submitted && (
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks! We'll be in touch soon.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}