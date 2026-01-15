import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { colorInput } from '@sanity/color-input'
import { apiVersion, dataset, projectId, schemaTypes } from '@vendly/sanity'
import { locations } from './src/lib/presentation/resolve'

// Extract tenant slug from URL path (e.g., /asird/studio -> asird)
function getTenantFromPath(): string {
    if (typeof window === 'undefined') return 'default'
    const match = window.location.pathname.match(/^\/([^/]+)\/studio/)
    return match?.[1] || 'default'
}

const tenant = getTenantFromPath()

export default defineConfig({
    name: tenant,
    title: `${tenant} Studio`,
    projectId,
    dataset,
    basePath: `/${tenant}/studio`,

    plugins: [
        presentationTool({
            resolve: { locations },
            previewUrl: {
                // Use the tenant subdomain for preview
                origin: typeof window !== 'undefined'
                    ? `${window.location.protocol}//${tenant}.${window.location.hostname.replace('admin.', '').split(':')[0]}:3000`
                    : 'http://localhost:3000',
                previewMode: {
                    enable: '/api/draft-mode/enable',
                    disable: '/api/draft-mode/disable',
                },
            },
        }),
        colorInput(),
    ],

    schema: {
        types: schemaTypes,
    },
})
