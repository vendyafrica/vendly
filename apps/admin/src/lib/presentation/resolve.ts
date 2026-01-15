import { defineLocations } from 'sanity/presentation'

export const locations = {
    homepage: defineLocations({
        locations: [
            { title: 'Home', href: '/' },
        ],
    }),
    header: defineLocations({
        locations: [
            { title: 'Home', href: '/' },
        ],
    }),
    footer: defineLocations({
        locations: [
            { title: 'Home', href: '/' },
        ],
    }),
    productDetailsPage: defineLocations({
        select: { title: 'title' },
        resolve: (doc) => ({
            locations: [
                { title: doc?.title || 'Product Page', href: '/products' },
            ],
        }),
    }),
    // Add other mappings as needed
}
