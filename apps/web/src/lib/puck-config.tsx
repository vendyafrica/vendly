import type { Config } from "@measured/puck";
import { HeaderBlock, type HeaderBlockProps } from "@/components/storefront/puck-blocks/HeaderBlock";
import { HeroBlock, type HeroBlockProps } from "@/components/storefront/puck-blocks/HeroBlock";
import { ProductGridBlock, type ProductGridBlockProps } from "@/components/storefront/puck-blocks/ProductGridBlock";
import { FooterBlock, type FooterBlockProps } from "@/components/storefront/puck-blocks/FooterBlock";

// Component types
export type Components = {
  HeaderBlock: HeaderBlockProps;
  HeroBlock: HeroBlockProps;
  ProductGridBlock: ProductGridBlockProps;
  FooterBlock: FooterBlockProps;
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
    HeaderBlock: {
      fields: {
        storeName: { type: "text", label: "Store Name" },
        backgroundColor: { type: "text", label: "Background Color" },
        textColor: { type: "text", label: "Text Color" },
        showSignIn: { type: "radio", label: "Show Sign In", options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ]},
        showCart: { type: "radio", label: "Show Cart", options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ]},
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
        showTitle: { type: "radio", label: "Show Title", options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ]},
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
        showNewsletter: { type: "radio", label: "Show Newsletter", options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ]},
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
  },
};

export default puckConfig;
