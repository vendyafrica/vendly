import { StorefrontHeader } from "./components/header";
import { FeaturedSection } from "./components/featured";
import { ProductGrid } from "./components/product-grid";
import { StorefrontFooter } from "./components/footer";
import { Hero } from "./components/hero";
import { Categories } from "./components/categories";
import { StoreThemeProvider } from "../../components/theme-provider";
import { FloatingThemeSwitcher } from "../../components/theme-switcher";
import { cn, themeClasses } from "../../lib/theme-utils";
import { MINIMAL_STORE } from "../../data/sample-stores";

const SAMPLE_STORE_CONFIG = MINIMAL_STORE;

export default async function StorefrontHomePage() {
  return (
    <StoreThemeProvider
      defaultVariant={SAMPLE_STORE_CONFIG.themeVariant}
      storeId={SAMPLE_STORE_CONFIG.id}
    >
      <div className={cn("min-h-screen", themeClasses.background.default)}>
        <StorefrontHeader config={SAMPLE_STORE_CONFIG.content.header} />

        <Hero config={SAMPLE_STORE_CONFIG.content.hero} />

        <div className="max-w-7xl mx-auto px-6 py-12">
          <Categories config={SAMPLE_STORE_CONFIG.content.categories} />

          <h3
            className={cn(
              "text-lg font-semibold m-8",
              themeClasses.text.default,
            )}
          >
            All Products
          </h3>
          <ProductGrid />

          <div className="my-20" />

          <FeaturedSection config={SAMPLE_STORE_CONFIG.content.featured} />
        </div>

        <StorefrontFooter config={SAMPLE_STORE_CONFIG.content.footer} />

        <FloatingThemeSwitcher />
      </div>
    </StoreThemeProvider>
  );
}
