export type HeroMode = "aspirational" | "scale";

export const heroCopy: Record<HeroMode, { prefix: string; variants: string[]; subhead: string }> = {
  aspirational: {
    prefix: "Be the next",
    variants: ["big brand.", "top creator.", "bestseller."],
    subhead: "Built for creators and businesses to sell online.",
  },
  scale: {
    prefix: "Sell to",
    variants: ["anyone.", "anywhere.", "your followers.", "new customers."],
    subhead: "Built for creators and businesses to sell online.",
  },
};
