import { getClient } from '@vendly/sanity'

export const client = getClient({
    useCdn: false,
    perspective: 'published',
    stega: {
        enabled: false,
        studioUrl: '/studio',
    },
})
