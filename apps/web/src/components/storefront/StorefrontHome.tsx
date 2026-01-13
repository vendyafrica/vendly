"use client";

import { useStorefrontStore } from "@/hooks/useStorefrontStore";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { BlockRenderer } from "./BlockRenderer";
import { StoreLayout } from "@vendly/ui/components/storefront/primitives/StoreLayout";
import { Footer } from "@vendly/ui/components/storefront/primitives/Footer";
import { Render } from "@measured/puck";
import { config } from "@vendly/ui/components/storefront/config";
import "@measured/puck/puck.css";

function toCssVarName(key: string) {
  return key.startsWith("--") ? key : `--${key}`;
}

type ThemeLike = {
  customCssVars?: Record<string, string> | null;
  themeConfig?: Record<string, unknown> | null;
  colors?: Record<string, string> | null;
  typography?: Record<string, any> | null;
  layout?: Record<string, any> | null;
};

// Helper maps for layout tokens
const RADIUS_MAP: Record<string, string> = {
  none: "0",
  small: "0.2rem",
  medium: "0.5rem",
  large: "1rem",
  full: "9999px",
};

const SPACING_MAP: Record<string, string> = {
  compact: "0.5",
  normal: "1",
  relaxed: "1.5",
  tight: "0.5", // Added tight map if needed
};

const CONTAINER_MAP: Record<string, string> = {
  narrow: "800px",
  normal: "1200px",
  wide: "1400px",
  full: "100%",
};

function buildCssVars(theme: unknown): React.CSSProperties {
  if (!theme || typeof theme !== "object") return {};
  const t = theme as ThemeLike;

  const cssVars: Record<string, string> = t.customCssVars ?? {};

  // Handle flattened storeThemes structure from DB schema
  const colors = (t.colors as Record<string, string>) || {};
  const typography = (t.typography as Record<string, any>) || {};
  const layout = (t.layout as Record<string, any>) || {};

  const style: React.CSSProperties = {};

  // 1. Inject Custom CSS Vars
  for (const [k, v] of Object.entries(cssVars)) {
    if (typeof v === "string") {
      (style as Record<string, string>)[toCssVarName(k)] = v;
    }
  }

  // 2. Typography
  if (typography.fontFamily) (style as Record<string, string>)["--font-sans"] = typography.fontFamily;
  if (typography.headingFont) (style as Record<string, string>)["--font-heading"] = typography.headingFont;
  if (typography.bodyFont) (style as Record<string, string>)["--font-body"] = typography.bodyFont;

  // 3. Layout Tokens
  if (layout.borderRadius && RADIUS_MAP[layout.borderRadius]) {
    (style as Record<string, string>)["--radius"] = RADIUS_MAP[layout.borderRadius];
  }
  if (layout.spacing && SPACING_MAP[layout.spacing]) {
    (style as Record<string, string>)["--spacing-factor"] = SPACING_MAP[layout.spacing];
  }
  if (layout.containerWidth && CONTAINER_MAP[layout.containerWidth]) {
    (style as Record<string, string>)["--container-max"] = CONTAINER_MAP[layout.containerWidth];
  }

  // 4. Colors
  // Map all color keys to CSS variables
  for (const [key, value] of Object.entries(colors)) {
    if (value && typeof value === "string") {
      (style as Record<string, string>)[toCssVarName(key)] = value;
    }
  }

  // Ensure defaults if not present
  if (!(style as any)["--background"]) (style as any)["--background"] = "#ffffff";
  if (!(style as any)["--foreground"]) (style as any)["--foreground"] = "#111111";
  if (!(style as any)["--primary"]) (style as any)["--primary"] = "#111111";
  if (!(style as any)["--radius"]) (style as any)["--radius"] = "0.5rem";

  return style;
}

export function StorefrontHome({ storeSlug }: { storeSlug: string }) {
  const { store, isLoading: isStoreLoading, error: storeError } = useStorefrontStore(storeSlug);
  const { products, isLoading: isProductsLoading, error: productsError } = useStorefrontProducts(storeSlug, {
    limit: 12,
  });

  if (isStoreLoading || isProductsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (storeError || productsError || !store) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Store Unavailable</h1>
          <p className="mt-2 text-sm text-gray-500">
            {(storeError || productsError)?.message || "We couldn't load this store."}
          </p>
        </div>
      </div>
    );
  }

  const cssVarStyle = buildCssVars(store.theme);

  // Use Puck editor data if available
  const content = store.content as any || {};
  const editorData = content.editorData;

  if (editorData && Object.keys(editorData.root || {}).length > 0) {
    return (
      <div className="min-h-screen" style={cssVarStyle}>
        <StoreLayout storeSlug={storeSlug} storeName={store.name}>
          <Render config={config} data={editorData} />
          <Footer
            storeSlug={storeSlug}
            storeName={store.name}
            content={content.footer}
          />
        </StoreLayout>
      </div>
    );
  }

  // Fallback to old block renderer
  const sections = [...(content.sections || [])];
  const heroConfig = content.hero || {};
  sections.unshift({
    type: "hero",
    ...heroConfig,
    enabled: true,
  });

  return (
    <div className="min-h-screen" style={cssVarStyle}>
      <StoreLayout storeSlug={storeSlug} storeName={store.name}>
        <div className="min-h-screen flex flex-col">
          <BlockRenderer
            sections={sections}
            storeSlug={storeSlug}
            storeName={store.name}
            store={store}
            products={products}
          />
          <Footer
            storeSlug={storeSlug}
            storeName={store.name}
            content={content.footer}
          />
        </div>
      </StoreLayout>
    </div>
  );
}
