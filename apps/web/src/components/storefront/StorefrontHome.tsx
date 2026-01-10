"use client";

import { StorefrontStandardTemplate } from "@/components/storefront/templates/StorefrontStandardTemplate";
import { useStorefrontStore } from "@/hooks/useStorefrontStore";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";

function toCssVarName(key: string) {
  return key.startsWith("--") ? key : `--${key}`;
}

type ThemeLike = {
  customCssVars?: Record<string, string> | null;
  themeConfig?: Record<string, unknown> | null;
};

type ContentLike = {
  heroImageUrl?: string | null;
} & Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function isLikelyImageUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.endsWith("/")) return false;
  const lower = trimmed.toLowerCase();
  return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp") || lower.endsWith(".gif");
}

function buildCssVars(theme: unknown): React.CSSProperties {
  const t: ThemeLike | undefined = isRecord(theme) ? (theme as ThemeLike) : undefined;
  if (!t) return {};

  const cssVars: Record<string, string> = t.customCssVars ?? {};

  // Handle both nested themeConfig (legacy/blobs) and flat structure (DB store_themes)
  const themeConfig = (t.themeConfig as Record<string, unknown>) || t;

  const colors = (themeConfig.colors as Record<string, string>) || {};
  const typography = (themeConfig.typography as Record<string, string>) || {};

  const style: React.CSSProperties = {};

  // Custom CSS Vars
  for (const [k, v] of Object.entries(cssVars)) {
    if (typeof v === "string") {
      (style as Record<string, string>)[toCssVarName(k)] = v;
    }
  }

  // Typography
  const headingFont = typography.headingFont || themeConfig.headingFont;
  const bodyFont = typography.bodyFont || themeConfig.bodyFont;

  if (typeof headingFont === "string") (style as Record<string, string>)["--font-heading"] = headingFont;
  if (typeof bodyFont === "string") (style as Record<string, string>)["--font-body"] = bodyFont;

  // Colors mapping (Assuming shadcn/tailwind variables are what we target)
  // Map our DB colors to CSS variables expected by the theme
  if (colors.background) (style as Record<string, string>)["--background"] = colors.background;
  if (colors.foreground) (style as Record<string, string>)["--foreground"] = colors.foreground;
  if (colors.primary) (style as Record<string, string>)["--primary"] = colors.primary;
  if (colors.primaryForeground) (style as Record<string, string>)["--primary-foreground"] = colors.primaryForeground;
  if (colors.secondary) (style as Record<string, string>)["--secondary"] = colors.secondary;
  if (colors.secondaryForeground) (style as Record<string, string>)["--secondary-foreground"] = colors.secondaryForeground;
  if (colors.muted) (style as Record<string, string>)["--muted"] = colors.muted;
  if (colors.mutedForeground) (style as Record<string, string>)["--muted-foreground"] = colors.mutedForeground;
  if (colors.accent) (style as Record<string, string>)["--accent"] = colors.accent;
  if (colors.accentForeground) (style as Record<string, string>)["--accent-foreground"] = colors.accentForeground;
  if (colors.card) (style as Record<string, string>)["--card"] = colors.card;
  if (colors.cardForeground) (style as Record<string, string>)["--card-foreground"] = colors.cardForeground;
  if (colors.border) (style as Record<string, string>)["--border"] = colors.border;
  if (colors.input) (style as Record<string, string>)["--input"] = colors.input;
  if (colors.ring) (style as Record<string, string>)["--ring"] = colors.ring;
  if (colors.radius) (style as Record<string, string>)["--radius"] = colors.radius;

  return style;
}

export function StorefrontHome({ storeSlug }: { storeSlug: string }) {
  const { store, isLoading: isStoreLoading, error: storeError } = useStorefrontStore(storeSlug);
  const { products, isLoading: isProductsLoading, error: productsError } = useStorefrontProducts(storeSlug, {
    limit: 12,
  });

  if (isStoreLoading || isProductsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (storeError || productsError || !store) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="text-xl font-semibold">Failed to load storefront</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {(storeError || productsError)?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const cssVarStyle = buildCssVars(store.theme);

  const contentObj: ContentLike = isRecord(store.content) ? (store.content as ContentLike) : ({} as ContentLike);

  const coverImageUrl =
    (() => {
      const u = getString(contentObj.heroImageUrl);
      return u && isLikelyImageUrl(u) ? u : undefined;
    })() ??
    products.find((p) => !!p.imageUrl)?.imageUrl ??
    null;

  return (
    <div className="min-h-screen" style={cssVarStyle}>
      <StorefrontStandardTemplate
        storeSlug={storeSlug}
        store={{
          id: store.id,
          name: store.name,
          slug: store.slug,
          description: store.description ?? null,
          logoUrl: store.logoUrl ?? null,
        }}
        theme={store.theme}
        content={{
          ...contentObj,
          heroImageUrl: coverImageUrl,
        }}
        products={products}
      />
    </div>
  );
}
