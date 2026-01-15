import { createClient, type ClientConfig } from 'next-sanity'
import { apiVersion, dataset, projectId, token } from './env'

export const baseConfig: ClientConfig = {
    projectId,
    dataset,
    apiVersion,
    token,
    perspective: 'published',
}

/**
 * Create a Sanity client with the shared configuration.
 * You can override the configuration by passing options.
 */
export function getClient(config?: ClientConfig) {
    return createClient({
        ...baseConfig,
        ...config,
    })
}

// Export a default client for simple use cases (e.g. scripts)
export const client = getClient({
    useCdn: false,
    stega: { enabled: false }
})
