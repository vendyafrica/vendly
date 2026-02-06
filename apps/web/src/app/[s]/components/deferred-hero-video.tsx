"use client";

import { useEffect, useState } from "react";

export function DeferredHeroVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const win = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === "function") {
      const id = win.requestIdleCallback(() => setShouldLoad(true), { timeout: 1500 });
      return () => {
        if (typeof win.cancelIdleCallback === "function") win.cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(() => setShouldLoad(true), 700);
    return () => window.clearTimeout(t);
  }, []);

  if (!shouldLoad) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
