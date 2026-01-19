import { StorefrontHeader } from "../../components/header";
import { StorefrontFooter } from "../../components/footer";
import { ProductDetails } from "../../components/product-details";
import { FeaturedSection } from "../../components/featured";
import { StoreThemeProvider } from "../../../../components/theme-provider";
import { FloatingThemeSwitcher } from "../../../../components/theme-switcher";
import { cn, themeClasses } from "../../../../lib/theme-utils";
import { COOL_STORE } from "../../../../data/sample-stores";

export default function ProductPage() {
    const STORE_CONFIG = COOL_STORE;

    return (
        <StoreThemeProvider
            defaultVariant={STORE_CONFIG.themeVariant}
            storeId={STORE_CONFIG.id}
        >
            <div className={cn("min-h-screen", themeClasses.background.default)}>
                <StorefrontHeader config={STORE_CONFIG.content.header} />

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <ProductDetails />

                    <div className="my-24" />

                    {/* Related / featured products */}
                    <FeaturedSection config={STORE_CONFIG.content.featured} />
                </div>

                <StorefrontFooter config={STORE_CONFIG.content.footer} />

                <FloatingThemeSwitcher />
            </div>
        </StoreThemeProvider>
    );
}
