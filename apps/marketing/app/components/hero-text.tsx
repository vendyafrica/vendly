"use client";

import TextLoop from "@/components/text-loop";

export default function HeroText() {
  return (
    <h1 className="text-4xl md:text-6xl xl:text-7xl font-semibold tracking-tight text-white">
      <TextLoop
        staticText="Commerce for"
        rotatingTexts={[
          "social sellers",
          "creators",
          "online brands",
          "DM-first businesses",
        ]}
      />
    </h1>
  );
}
