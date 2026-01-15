import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, token } from './env'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Set to false for admin to always get fresh data
    token,
    perspective: 'published',
    stega: {
        enabled: false, // Disable stega in admin, enable in web for visual editing
        studioUrl: '/studio',
    },
})
