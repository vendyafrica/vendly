"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        email: "", 
        phone: "", 
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
      className="relative overflow-hidden bg-background py-32 sm:py-40"
      id={id}
    >
      {/* Subtle glow from below */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[700px] w-[1000px] rounded-full bg-primary/[0.08] blur-[140px] -z-10" />
      <div className="absolute bottom-10 left-1/3 h-[600px] w-[700px] rounded-full bg-primary/[0.05] blur-[120px] -z-10" />

      <div className="mx-auto max-w-3xl px-6 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
          One <span className="text-primary">platform</span> to run your business
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Sell anywhere. Vendly gives you the tools to sell products anywhere,
          manage everything in one place, and grow your business faster.
        </p>

        {/* Minimalist input */}
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