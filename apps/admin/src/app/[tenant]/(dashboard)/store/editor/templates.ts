export const templates = {
    home: {
        root: { title: "Home Page" },
        content: [
            {
                type: "Hero",
                props: {
                    id: "hero-1",
                    title: "Spring Collection 2024",
                    subtitle: "Discover the new trends.",
                    align: "center"
                }
            },
            {
                type: "Section",
                props: {
                    id: "section-1",
                    backgroundColor: "bg-white",
                    padding: "py-16"
                }
            },
            {
                type: "ProductGrid",
                props: {
                    id: "products-1",
                    title: "Featured Products"
                }
            }
        ],
        zones: {
            "section-1:content": [
                {
                    type: "HeadingBlock",
                    props: {
                        id: "heading-1",
                        title: "Why Choose Us?"
                    }
                }
            ]
        }
    },
    product: {
        root: { title: "Product Page" },
        content: [
            {
                type: "HeadingBlock",
                props: {
                    id: "product-header",
                    title: "Product Details"
                }
            },
            {
                type: "Section",
                props: {
                    id: "description-section",
                    backgroundColor: "bg-gray-50",
                    padding: "py-8"
                }
            }
        ]
    }
};
