"use client";

import React, { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";

export default function ContactUs({ id }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim()) return;

    setLoading(true);

    try {
      // Your contact API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setEmail("");
      setPhone("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Contact error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-background py-24 sm:py-32 border-t"
      id={id}
    >
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Get in <span className="text-primary">touch</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 700 000 000"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading || submitted}
            className="w-full"
          >
            {loading ? "Sending..." : submitted ? "Sent" : "Send Message"}
          </Button>

          {submitted && (
            <p className="text-sm text-muted-foreground text-center">
              Thanks for reaching out! We'll get back to you soon.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}