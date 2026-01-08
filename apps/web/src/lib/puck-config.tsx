import type { Config } from "@measured/puck";

// Import original blocks
import { HeaderBlock, type HeaderBlockProps } from "@/components/storefront/puck-blocks/HeaderBlock";
import { HeroBlock, type HeroBlockProps } from "@/components/storefront/puck-blocks/HeroBlock";
import { ProductGridBlock, type ProductGridBlockProps } from "@/components/storefront/puck-blocks/ProductGridBlock";
import { FooterBlock, type FooterBlockProps } from "@/components/storefront/puck-blocks/FooterBlock";

// Import Fashion template blocks
import {
  FashionHeader,
  type FashionHeaderProps,
  FashionHero,
  type FashionHeroProps,
  FashionCategoryTabs,
  FashionProductGrid,
  type FashionProductGridProps,
  FashionFooter,
  type FashionFooterProps,
} from "@/components/storefront/templates/fashion";

// Component types
export type Components = {
  // Original blocks
  HeaderBlock: HeaderBlockProps;
  HeroBlock: HeroBlockProps;
  ProductGridBlock: ProductGridBlockProps;
  FooterBlock: FooterBlockProps;
  // Fashion template blocks
  FashionHeader: FashionHeaderProps;
  FashionHero: FashionHeroProps;
  FashionCategoryTabs: { categoriesText: string; showSection: boolean };
  FashionProductGrid: FashionProductGridProps;
  FashionFooter: FashionFooterProps;
};

// Root props
export type RootProps = {
  title: string;
  description: string;
  backgroundColor: string;
  primaryColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
};

// Puck configuration using functional blocks
export const puckConfig: Config<Components, RootProps> = {
  root: {
    fields: {
      title: { type: "text", label: "Page Title" },
      description: { type: "textarea", label: "Page Description" },
      backgroundColor: { type: "text", label: "Background Color" },
      primaryColor: { type: "text", label: "Primary Color" },
      textColor: { type: "text", label: "Text Color" },
      headingFont: {
        type: "select",
        label: "Heading Font",
        options: [
          { label: "Playfair Display", value: "Playfair Display" },
          { label: "Inter", value: "Inter" },
          { label: "Montserrat", value: "Montserrat" },
        ],
      },
      bodyFont: {
        type: "select",
        label: "Body Font",
        options: [
          { label: "Inter", value: "Inter" },
          { label: "Roboto", value: "Roboto" },
          { label: "Open Sans", value: "Open Sans" },
        ],
      },
    },
    defaultProps: {
      title: "Home",
      description: "Welcome to our store",
      backgroundColor: "#ffffff",
      primaryColor: "#1a1a2e",
      textColor: "#1a1a2e",
      headingFont: "Playfair Display",
      bodyFont: "Inter",
    },
    render: ({ children, backgroundColor, headingFont, bodyFont }) => (
      <div
        style={{
          backgroundColor,
          minHeight: "100vh",
          // @ts-expect-error CSS custom properties
          "--heading-font": headingFont,
          "--body-font": bodyFont,
        }}
      >
        {children}
      </div>
    ),
  },

  components: {
    // =====================
    // ORIGINAL BLOCKS
    // =====================
    HeaderBlock: {
      fields: {
        storeName: { type: "text", label: "Store Name" },
        backgroundColor: { type: "text", label: "Background Color" },
        textColor: { type: "text", label: "Text Color" },
        showSignIn: {
          type: "radio", label: "Show Sign In", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
        showCart: {
          type: "radio", label: "Show Cart", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
      },
      defaultProps: {
        storeName: "My Store",
        backgroundColor: "#1a1a2e",
        textColor: "#ffffff",
        showSignIn: true,
        showCart: true,
      },
      render: HeaderBlock,
    },

    HeroBlock: {
      fields: {
        label: { type: "text", label: "Category Label" },
        title: { type: "textarea", label: "Headline" },
        subtitle: { type: "textarea", label: "Subtitle" },
        ctaText: { type: "text", label: "Button Text" },
        ctaLink: { type: "text", label: "Button Link" },
        backgroundColor: { type: "text", label: "Background Color" },
        textColor: { type: "text", label: "Text Color" },
        imageUrl: { type: "text", label: "Background Image URL" },
      },
      defaultProps: {
        label: "NEW COLLECTION",
        title: "Discover Our Collection",
        subtitle: "Explore our curated selection of premium products.",
        ctaText: "Shop Now",
        ctaLink: "/products",
        backgroundColor: "#4a6fa5",
        textColor: "#ffffff",
        imageUrl: null,
      },
      render: HeroBlock,
    },

    ProductGridBlock: {
      fields: {
        title: { type: "text", label: "Section Title" },
        showTitle: {
          type: "radio", label: "Show Title", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
        columns: { type: "number", label: "Columns", min: 2, max: 6 },
        maxProducts: { type: "number", label: "Max Products", min: 4, max: 24 },
      },
      defaultProps: {
        title: "Featured Products",
        showTitle: true,
        columns: 4,
        maxProducts: 8,
      },
      render: ProductGridBlock,
    },

    FooterBlock: {
      fields: {
        storeName: { type: "text", label: "Store Name" },
        backgroundColor: { type: "text", label: "Background Color" },
        textColor: { type: "text", label: "Text Color" },
        showNewsletter: {
          type: "radio", label: "Show Newsletter", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
        newsletterTitle: { type: "text", label: "Newsletter Title" },
        newsletterSubtitle: { type: "text", label: "Newsletter Subtitle" },
      },
      defaultProps: {
        storeName: "My Store",
        backgroundColor: "#1a1a2e",
        textColor: "#ffffff",
        showNewsletter: false,
        newsletterTitle: "Subscribe to our newsletter",
        newsletterSubtitle: "Get the latest updates",
      },
      render: FooterBlock,
    },

    // =====================
    // FASHION TEMPLATE BLOCKS
    // =====================
    FashionHeader: {
      label: "Fashion Header",
      fields: {
        storeName: { type: "text", label: "Store Name" },
        storeSlug: { type: "text", label: "Store Slug" },
        backgroundColor: { type: "text", label: "Background Color" },
        textColor: { type: "text", label: "Text Color" },
        showHome: {
          type: "radio", label: "Show Home", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
        showShop: {
          type: "radio", label: "Show Shop", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
        showCart: {
          type: "radio", label: "Show Cart", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
        showUser: {
          type: "radio", label: "Show User", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
      },
      defaultProps: {
        storeName: "My Store",
        storeSlug: "my-store",
        backgroundColor: "#1e3a5f",
        textColor: "#ffffff",
        showHome: true,
        showShop: true,
        showCart: true,
        showUser: true,
      },
      render: FashionHeader,
    },

    FashionHero: {
      label: "Fashion Hero",
      fields: {
        label: { type: "text", label: "Category Label" },
        title: { type: "textarea", label: "Headline" },
        ctaText: { type: "text", label: "Button Text" },
        ctaLink: { type: "text", label: "Button Link" },
        ctaPadding: { type: "text", label: "Button Padding (e.g., 16px 32px)" },
        imageUrl: { type: "text", label: "Background Image URL" },
        overlayColor: { type: "text", label: "Overlay Color (rgba format)" },
      },
      defaultProps: {
        label: "FASHION",
        title: "Style at Your Fingertips",
        ctaText: "Shop Now",
        ctaLink: "/products",
        ctaPadding: "16px 32px",
        imageUrl: "",
        overlayColor: "rgba(0, 0, 0, 0.4)",
      },
      render: FashionHero,
    },

    FashionCategoryTabs: {
      label: "Fashion Category Tabs",
      fields: {
        categoriesText: {
          type: "text",
          label: "Categories (comma-separated)",
        },
        showSection: {
          type: "radio", label: "Show Section", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
      },
      defaultProps: {
        categoriesText: "Women, Men",
        showSection: true,
      },
      render: ({ categoriesText, showSection }) => {
        const categories = categoriesText?.split(",").map((c: string) => c.trim()).filter(Boolean) || [];
        if (!showSection || categories.length === 0) {
          return <div style={{ display: "none" }} />;
        }
        return <FashionCategoryTabs categories={categories} showSection={showSection} />;
      },
    },

    FashionProductGrid: {
      label: "Fashion Product Grid",
      fields: {
        title: { type: "text", label: "Section Title" },
        showTitle: {
          type: "radio", label: "Show Title", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "3 Columns", value: 3 },
            { label: "4 Columns", value: 4 },
          ],
        },
        storeSlug: { type: "text", label: "Store Slug" },
      },
      defaultProps: {
        title: "New Arrivals",
        showTitle: true,
        columns: 4,
        storeSlug: "",
      },
      render: FashionProductGrid,
    },

    FashionFooter: {
      label: "Fashion Footer",
      fields: {
        storeName: { type: "text", label: "Store Name" },
        storeSlug: { type: "text", label: "Store Slug" },
        backgroundColor: { type: "text", label: "Background Color" },
        textColor: { type: "text", label: "Text Color" },
        showPoweredBy: {
          type: "radio", label: "Show 'Powered by Vendly'", options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]
        },
      },
      defaultProps: {
        storeName: "My Store",
        storeSlug: "my-store",
        backgroundColor: "#1e3a5f",
        textColor: "#ffffff",
        showPoweredBy: true,
      },
      render: FashionFooter,
    },
  },
};

export default puckConfig;
