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
  const cssVars: Record<string, string> = t?.customCssVars ?? {};
  const themeConfig: Record<string, unknown> = t?.themeConfig ?? {};

  const style: React.CSSProperties = {};

  for (const [k, v] of Object.entries(cssVars)) {
    if (typeof v === "string") {
      (style as Record<string, string>)[toCssVarName(k)] = v;
    }
  }

  const headingFont = themeConfig.headingFont;
  const bodyFont = themeConfig.bodyFont;
  if (typeof headingFont === "string") (style as Record<string, string>)["--font-heading"] = headingFont;
  if (typeof bodyFont === "string") (style as Record<string, string>)["--font-body"] = bodyFont;

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
