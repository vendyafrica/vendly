import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, token } from './env'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true, // Use CDN for faster reads in production
    token,
    perspective: 'published',
    stega: {
        enabled: process.env.NODE_ENV === 'development',
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:4000/studio',
    },
})
