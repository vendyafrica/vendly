import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { colorInput } from '@sanity/color-input'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
    name: 'vendly',
    title: 'Vendly CMS',
    projectId,
    dataset,
    basePath: '/studio',

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        S.listItem()
                            .title('Design Systems')
                            .child(
                                S.documentTypeList('designSystem')
                                    .title('Design Systems')
                            ),
                        S.divider(),
                        S.listItem()
                            .title('Store Settings')
                            .child(
                                S.documentTypeList('storeSettings')
                                    .title('Store Settings')
                            ),
                        S.divider(),
                        S.listItem()
                            .title('Homepage')
                            .child(
                                S.documentTypeList('homepage')
                                    .title('Homepage')
                            ),
                        S.listItem()
                            .title('Header')
                            .child(
                                S.documentTypeList('header')
                                    .title('Header')
                            ),
                        S.listItem()
                            .title('Footer')
                            .child(
                                S.documentTypeList('footer')
                                    .title('Footer')
                            ),
                    ]),
        }),
        presentationTool({
            previewUrl: {
                origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
                previewMode: {
                    enable: '/api/draft-mode/enable',
                },
            },
        }),
        visionTool({ defaultApiVersion: apiVersion }),
        colorInput(),
    ],

    schema: {
        types: schemaTypes,
    },
})
