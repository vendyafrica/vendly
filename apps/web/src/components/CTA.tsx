"use client";

import React, { useState } from "react";


export default function Waitlist() {
  const [storeName, setStoreName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Limited Early Access Available
        </div>

        {/* Main Heading */}
        <h1 className="mt-8 text-4xl font-geist tracking-tight text-foreground sm:text-5xl md:text-6xl leading-tight">
          Get your <span className="text-primary">vendly</span> store
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-5 max-w-2xl text-base text-black sm:text-lg leading-relaxed">
          Transform how we sell online. Reserve your custom subdomain and get
          exclusive early access with premium features.
        </p>

        <div className="mt-10 mx-auto max-w-2xl space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3 rounded-lg bg-muted/40 p-1.5 backdrop-blur-sm border border-border">
            <div className="flex-1 w-full relative">
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="@yourstore"
                className="h-11 w-full rounded-md border-none bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                .vendly.store
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
