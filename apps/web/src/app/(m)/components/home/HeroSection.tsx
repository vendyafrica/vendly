"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { useEffect, useMemo, useState } from "react";

import { Typewriter } from "@/components/ui/typewriter";
import { heroCopy, type HeroMode } from "@/content/heroCopy";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  // Default to a deterministic value for SSR to avoid hydration mismatches.
  const [mode, setMode] = useState<HeroMode>("aspirational");

  useEffect(() => {
    const storageKey = "vendly-hero-mode";

    const stored = window.sessionStorage.getItem(storageKey);
    if (stored === "aspirational" || stored === "scale") {
      setMode(stored);
      return;
    }

    const options: HeroMode[] = ["aspirational", "scale"];
    const randomMode = options[Math.floor(Math.random() * options.length)];
    window.sessionStorage.setItem(storageKey, randomMode);
    setMode(randomMode);
  }, []);

  const copy = useMemo(() => heroCopy[mode], [mode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // TODO: Implement search navigation
  };

  return (
    <div className="relative bg-white pt-12 pb-10 md:pt-16 md:pb-14 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-xl md:text-3xl font-medium tracking-tight mb-2 text-foreground">
          <span>{copy.prefix} </span>
          <Typewriter
            text={copy.variants}
            speed={35}
            deleteSpeed={35}
            waitTime={3000}
            initialDelay={250}
            className="text-primary/80"
            cursorChar="_"
          />
        </h1>

        {/* Subheadline */}
        <p className="text-muted-foreground text-md md:text-md mb-4 max-w-2xl mx-auto">
          {copy.subhead}
        </p>

        {/* Search / CTA */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-2">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search stores and products..."
              className="w-full h-12 pl-12 pr-14 text-md rounded-full bg-background shadow-sm border-border hover:border-primary/50 focus:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              suppressHydrationWarning
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full p-0 grid place-items-center"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
