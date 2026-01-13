import type { Config } from "@measured/puck";
import { HeadingBlock } from "./heading-block";
import { Hero } from "./hero";
import { ProductGrid } from "./product-grid";
import { Section } from "./section";

export type Props = {
    HeadingBlock: { title: string; align: "left" | "center" | "right" };
    Hero: {
        title: string;
        subtitle: string;
        align: "left" | "center";
        backgroundImage?: string;
        overlayColor?: string;
        textColor?: string;
        height?: "small" | "medium" | "large";
    };
    ProductGrid: {
        title: string;
        columns?: number;
        gap?: "small" | "medium" | "large";
    };
    Section: {
        backgroundColor: string;
        padding: string;
        maxWidth?: "full" | "contained";
        className?: string; // For advanced CSS
    };
};

export const config: Config<Props> = {
    components: {
        HeadingBlock: {
            fields: {
                title: { type: "text" },
                align: {
                    type: "radio",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                    ]
                }
            },
            defaultProps: {
                title: "Heading",
                align: "left",
            },
            render: ({ title, align }) => (
                <HeadingBlock title={title} style={{ textAlign: align }} />
            ),
        },
        Hero: {
            fields: {
                // Content
                title: { type: "text" },
                subtitle: { type: "text" },
                backgroundImage: { type: "text", label: "Image URL" },

                // Design
                align: {
                    type: "radio",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                    ],
                },
                overlayColor: {
                    type: "select",
                    options: [
                        { label: "None", value: "transparent" },
                        { label: "Black", value: "rgba(0,0,0,0.5)" },
                        { label: "White", value: "rgba(255,255,255,0.5)" },
                    ]
                },
                height: {
                    type: "select",
                    options: [
                        { label: "Small", value: "small" },
                        { label: "Medium", value: "medium" },
                        { label: "Large", value: "large" },
                    ]
                }
            },
            defaultProps: {
                title: "Welcome to our store",
                subtitle: "Best products for you",
                align: "center",
                height: "medium",
            },
            render: ({ title, subtitle, align, backgroundImage, height }) => (
                <Hero
                    title={title}
                    subtitle={subtitle}
                    align={align}
                    backgroundImage={backgroundImage}
                    height={height}
                />
            ),
        },
        ProductGrid: {
            fields: {
                title: { type: "text" },
                columns: {
                    type: "number",
                    min: 2,
                    max: 4,
                }
            },
            defaultProps: {
                title: "Featured Products",
                columns: 4,
            },
            render: ({ title, columns }) => (
                <ProductGrid title={title} columns={columns} />
            ),
        },
        Section: {
            fields: {
                // Design
                backgroundColor: {
                    type: "radio",
                    options: [
                        { label: "White", value: "bg-white" },
                        { label: "Gray", value: "bg-gray-50" },
                        { label: "Black", value: "bg-gray-900" },
                    ]
                },
                padding: {
                    type: "select",
                    options: [
                        { label: "Small", value: "py-8" },
                        { label: "Medium", value: "py-16" },
                        { label: "Large", value: "py-24" },
                    ]
                },
                maxWidth: {
                    type: "radio",
                    options: [
                        { label: "Full Width", value: "full" },
                        { label: "Contained", value: "contained" },
                    ]
                }
            },
            defaultProps: {
                backgroundColor: "bg-white",
                padding: "py-16",
                maxWidth: "contained",
            },
            render: ({ backgroundColor, padding, maxWidth, puck: { renderDropZone } }) => (
                <Section backgroundColor={backgroundColor} padding={padding} maxWidth={maxWidth}>
                    {/* @ts-expect-error - renderDropZone type definition mismatch */}
                    {renderDropZone({ zone: "content" })}
                </Section>
            ),
        }
    },
    root: {
        render: ({ children }) => children,
    },
};
