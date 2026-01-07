"use client";

import type { Config } from "@measured/puck";

// Component prop types
export type HeaderBlockProps = {
  storeName: string;
  backgroundColor: string;
  textColor: string;
};

export type HeroBlockProps = {
  label: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
  textColor: string;
};

export type ProductGridBlockProps = {
  title: string;
  showTitle: boolean;
  columns: number;
  maxProducts: number;
};

export type FeaturedSectionBlockProps = {
  label: string;
  title: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
  textColor: string;
  size: "normal" | "tall" | "wide";
};

export type TextBlockProps = {
  content: string;
  align: "left" | "center" | "right";
  fontSize: "sm" | "base" | "lg" | "xl" | "2xl";
};

export type SpacerBlockProps = {
  height: number;
};

export type ImageBlockProps = {
  src: string;
  alt: string;
  aspectRatio: "auto" | "16/9" | "4/3" | "1/1" | "3/4";
};

export type FooterBlockProps = {
  showNewsletter: boolean;
  newsletterTitle: string;
  newsletterSubtitle: string;
  backgroundColor: string;
  textColor: string;
};

// Define all component types
export type Components = {
  HeaderBlock: HeaderBlockProps;
  HeroBlock: HeroBlockProps;
  ProductGridBlock: ProductGridBlockProps;
  FeaturedSectionBlock: FeaturedSectionBlockProps;
  TextBlock: TextBlockProps;
  SpacerBlock: SpacerBlockProps;
  ImageBlock: ImageBlockProps;
  FooterBlock: FooterBlockProps;
};

// Root props for page-level settings
export type RootProps = {
  title: string;
  description: string;
  backgroundColor: string;
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
};

// Puck configuration
export const puckConfig: Config<Components, RootProps> = {
  categories: {
    layout: {
      components: ["HeaderBlock", "FooterBlock", "SpacerBlock"],
      title: "Layout",
      defaultExpanded: true,
    },
    hero: {
      components: ["HeroBlock", "FeaturedSectionBlock"],
      title: "Hero & Featured",
      defaultExpanded: true,
    },
    content: {
      components: ["TextBlock", "ImageBlock", "ProductGridBlock"],
      title: "Content",
      defaultExpanded: true,
    },
  },

  root: {
    fields: {
      title: { type: "text", label: "Page Title" },
      description: { type: "textarea", label: "Page Description" },
      backgroundColor: { type: "text", label: "Background Color" },
      primaryColor: { type: "text", label: "Primary Color" },
      headingFont: {
        type: "select",
        label: "Heading Font",
        options: [
          { label: "Inter", value: "Inter" },
          { label: "Roboto", value: "Roboto" },
          { label: "Playfair Display", value: "Playfair Display" },
          { label: "Poppins", value: "Poppins" },
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
          { label: "Lora", value: "Lora" },
        ],
      },
    },
    defaultProps: {
      title: "Home",
      description: "Welcome to our store",
      backgroundColor: "#ffffff",
      primaryColor: "#1a1a2e",
      headingFont: "Inter",
      bodyFont: "Inter",
    },
    render: ({ children, title, backgroundColor, primaryColor, headingFont, bodyFont }) => (
      <div 
        style={{ 
          backgroundColor,
          minHeight: "100vh",
          fontFamily: bodyFont,
          // @ts-expect-error CSS custom properties
          "--theme-primary": primaryColor,
          "--theme-heading-font": headingFont,
          "--theme-body-font": bodyFont,
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
      },
      defaultProps: {
        storeName: "My Store",
        backgroundColor: "#1a1a2e",
        textColor: "#ffffff",
      },
      render: ({ storeName, backgroundColor, textColor }) => (
        <header 
          style={{ 
            backgroundColor, 
            color: textColor,
            padding: "1rem 2rem",
          }}
        >
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            maxWidth: "1400px",
            margin: "0 auto",
          }}>
            <nav style={{ display: "flex", gap: "2rem" }}>
              <a href="#" style={{ color: textColor, textDecoration: "none", fontSize: "0.875rem" }}>Home</a>
              <a href="#" style={{ color: textColor, textDecoration: "none", fontSize: "0.875rem" }}>Shop</a>
              <a href="#" style={{ color: textColor, textDecoration: "none", fontSize: "0.875rem" }}>Blog</a>
            </nav>
            <span style={{ 
              fontFamily: "var(--theme-heading-font, serif)", 
              fontSize: "1.5rem",
              fontStyle: "italic",
            }}>
              {storeName}
            </span>
            <div style={{ display: "flex", gap: "1rem" }}>
              <span>🔍</span>
              <span>❤️</span>
              <span>🛒</span>
            </div>
          </div>
        </header>
      ),
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
      },
      defaultProps: {
        label: "Urban Style",
        title: "Discover Our Collection",
        subtitle: "Explore our curated selection of premium products designed for the modern lifestyle.",
        ctaText: "Discover Now",
        ctaLink: "/products",
        backgroundColor: "#4a6fa5",
        textColor: "#ffffff",
      },
      render: ({ label, title, subtitle, ctaText, backgroundColor, textColor }) => (
        <section 
          style={{ 
            backgroundColor,
            color: textColor,
            padding: "6rem 2rem",
            position: "relative",
            minHeight: "500px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: "600px" }}>
            <span style={{ 
              fontSize: "0.75rem", 
              fontWeight: 600, 
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.8,
            }}>
              {label}
            </span>
            <h1 style={{ 
              fontSize: "3rem", 
              fontWeight: 700,
              marginTop: "1rem",
              marginBottom: "1.5rem",
              lineHeight: 1.1,
              fontFamily: "var(--theme-heading-font, serif)",
            }}>
              {title}
            </h1>
            <p style={{ 
              fontSize: "1.125rem", 
              opacity: 0.8,
              marginBottom: "2rem",
              maxWidth: "400px",
            }}>
              {subtitle}
            </p>
            <button style={{
              backgroundColor: "var(--theme-primary, #1a1a2e)",
              color: textColor,
              padding: "1rem 2rem",
              border: "none",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: "pointer",
            }}>
              {ctaText}
            </button>
          </div>
        </section>
      ),
    },

    ProductGridBlock: {
      fields: {
        title: { type: "text", label: "Section Title" },
        showTitle: { type: "radio", label: "Show Title", options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
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
      render: ({ title, showTitle, columns, maxProducts }) => (
        <section style={{ padding: "4rem 2rem", backgroundColor: "#fff" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {showTitle && (
              <h2 style={{ 
                textAlign: "center", 
                marginBottom: "3rem",
                fontSize: "1.5rem",
                fontWeight: 600,
                fontFamily: "var(--theme-heading-font, serif)",
              }}>
                {title}
              </h2>
            )}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: "1.5rem",
            }}>
              {Array.from({ length: Math.min(maxProducts, 8) }).map((_, i) => (
                <div key={i} style={{ 
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}>
                  <div style={{ 
                    backgroundColor: "#e0e0e0", 
                    paddingTop: "100%",
                    position: "relative",
                  }}>
                    <span style={{ 
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "#999",
                    }}>
                      Product {i + 1}
                    </span>
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>Product Name</p>
                    <p style={{ color: "#666" }}>$99.00</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ 
              textAlign: "center", 
              marginTop: "1rem", 
              color: "#888",
              fontSize: "0.875rem",
            }}>
              Products will be loaded from your store database
            </p>
          </div>
        </section>
      ),
    },

    FeaturedSectionBlock: {
      fields: {
        label: { type: "text", label: "Label" },
        title: { type: "text", label: "Title" },
        ctaText: { type: "text", label: "CTA Text" },
        ctaLink: { type: "text", label: "CTA Link" },
        backgroundColor: { type: "text", label: "Background Color" },
        textColor: { type: "text", label: "Text Color" },
        size: { 
          type: "select", 
          label: "Size",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Tall", value: "tall" },
            { label: "Wide", value: "wide" },
          ],
        },
      },
      defaultProps: {
        label: "NEW COLLECTION",
        title: "Explore Our Latest Arrivals",
        ctaText: "Shop Now",
        ctaLink: "/products",
        backgroundColor: "#f5f5f5",
        textColor: "#1a1a1a",
        size: "normal",
      },
      render: ({ label, title, ctaText, backgroundColor, textColor, size }) => {
        const heights = { normal: "240px", tall: "480px", wide: "200px" };
        return (
          <div style={{
            backgroundColor,
            color: textColor,
            padding: "2rem",
            borderRadius: "8px",
            minHeight: heights[size],
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}>
            <span style={{ 
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: "0.5rem",
            }}>
              {label}
            </span>
            <h3 style={{ 
              fontSize: "1.25rem",
              fontFamily: "var(--theme-heading-font, serif)",
              marginBottom: "1rem",
            }}>
              {title}
            </h3>
            <a href="#" style={{ 
              color: textColor,
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
            }}>
              {ctaText} →
            </a>
          </div>
        );
      },
    },

    TextBlock: {
      fields: {
        content: { type: "textarea", label: "Content" },
        align: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        fontSize: {
          type: "select",
          label: "Font Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Base", value: "base" },
            { label: "Large", value: "lg" },
            { label: "XL", value: "xl" },
            { label: "2XL", value: "2xl" },
          ],
        },
      },
      defaultProps: {
        content: "Add your text content here...",
        align: "left",
        fontSize: "base",
      },
      render: ({ content, align, fontSize }) => {
        const sizes = { sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem" };
        return (
          <div style={{ 
            padding: "2rem",
            textAlign: align,
            fontSize: sizes[fontSize],
            lineHeight: 1.7,
          }}>
            {content}
          </div>
        );
      },
    },

    SpacerBlock: {
      fields: {
        height: { type: "number", label: "Height (px)", min: 8, max: 200 },
      },
      defaultProps: {
        height: 48,
      },
      render: ({ height }) => (
        <div style={{ height: `${height}px` }} />
      ),
    },

    ImageBlock: {
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt Text" },
        aspectRatio: {
          type: "select",
          label: "Aspect Ratio",
          options: [
            { label: "Auto", value: "auto" },
            { label: "16:9", value: "16/9" },
            { label: "4:3", value: "4/3" },
            { label: "1:1", value: "1/1" },
            { label: "3:4", value: "3/4" },
          ],
        },
      },
      defaultProps: {
        src: "",
        alt: "Image",
        aspectRatio: "auto",
      },
      render: ({ src, alt, aspectRatio }) => (
        <div style={{ 
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
        }}>
          {src ? (
            <img 
              src={src} 
              alt={alt}
              style={{ 
                maxWidth: "100%",
                aspectRatio: aspectRatio === "auto" ? undefined : aspectRatio,
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ) : (
            <div style={{
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "#e0e0e0",
              aspectRatio: aspectRatio === "auto" ? "16/9" : aspectRatio,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
            }}>
              Add image URL
            </div>
          )}
        </div>
      ),
    },

    FooterBlock: {
      fields: {
        showNewsletter: { type: "radio", label: "Show Newsletter", options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]},
        newsletterTitle: { type: "text", label: "Newsletter Title" },
        newsletterSubtitle: { type: "text", label: "Newsletter Subtitle" },
        backgroundColor: { type: "text", label: "Background Color" },
        textColor: { type: "text", label: "Text Color" },
      },
      defaultProps: {
        showNewsletter: true,
        newsletterTitle: "Subscribe to our newsletter",
        newsletterSubtitle: "Get the latest updates on new products and upcoming sales",
        backgroundColor: "#1a1a2e",
        textColor: "#ffffff",
      },
      render: ({ showNewsletter, newsletterTitle, newsletterSubtitle, backgroundColor, textColor }) => (
        <footer style={{ backgroundColor, color: textColor }}>
          {showNewsletter && (
            <div style={{ 
              borderBottom: `1px solid ${textColor}20`,
              padding: "3rem 2rem",
            }}>
              <div style={{ 
                maxWidth: "1200px", 
                margin: "0 auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}>
                <div>
                  <h3 style={{ 
                    fontFamily: "var(--theme-heading-font, serif)",
                    marginBottom: "0.5rem",
                  }}>
                    {newsletterTitle}
                  </h3>
                  <p style={{ opacity: 0.7, fontSize: "0.875rem" }}>{newsletterSubtitle}</p>
                </div>
                <div style={{ display: "flex" }}>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    style={{
                      padding: "0.75rem 1rem",
                      backgroundColor: `${textColor}15`,
                      border: `1px solid ${textColor}30`,
                      color: textColor,
                      width: "280px",
                    }}
                  />
                  <button style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: textColor,
                    color: backgroundColor,
                    border: "none",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}>
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          )}
          <div style={{ padding: "3rem 2rem" }}>
            <div style={{ 
              maxWidth: "1200px", 
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: "2rem",
            }}>
              <div>
                <span style={{ 
                  fontFamily: "var(--theme-heading-font, serif)",
                  fontSize: "1.5rem",
                  fontStyle: "italic",
                }}>
                  Store Name
                </span>
              </div>
              {["Company", "Help", "Legal"].map((section) => (
                <div key={section}>
                  <h4 style={{ 
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "1rem",
                  }}>
                    {section}
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {["Link 1", "Link 2", "Link 3"].map((link) => (
                      <li key={link} style={{ marginBottom: "0.75rem" }}>
                        <a href="#" style={{ color: textColor, opacity: 0.7, textDecoration: "none", fontSize: "0.875rem" }}>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div style={{ 
            borderTop: `1px solid ${textColor}20`,
            padding: "1.5rem 2rem",
            textAlign: "center",
            fontSize: "0.875rem",
            opacity: 0.6,
          }}>
            © 2026 Store Name. All rights reserved. Powered by Vendly
          </div>
        </footer>
      ),
    },
  },
};

export default puckConfig;
