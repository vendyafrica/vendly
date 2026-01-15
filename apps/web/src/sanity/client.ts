import { getClient } from '@vendly/sanity'

export const client = getClient({
    useCdn: true,
    perspective: 'published',
    stega: {
        enabled: process.env.NODE_ENV === 'development',
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:4000/studio',
    },
})
