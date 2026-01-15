import { defineType, defineField } from 'sanity'

export const header = defineType({
    name: 'header',
    title: 'Header',
    type: 'document',
    fields: [
        defineField({
            name: 'storeId',
            title: 'Store ID',
            type: 'string',
            validation: (Rule) => Rule.required(),
            hidden: true,
        }),
        defineField({
            name: 'storeName',
            title: 'Store Name',
            type: 'string',
            description: 'Displayed in the header logo area',
        }),
        defineField({
            name: 'logo',
            title: 'Logo Image (Optional)',
            type: 'image',
            description: 'If provided, will replace the store name text',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'navigationLinks',
            title: 'Navigation Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'label',
                            title: 'Label',
                            type: 'string',
                        },
                        {
                            name: 'url',
                            title: 'URL',
                            type: 'string',
                        },
                    ],
                },
            ],
            initialValue: [
                { label: 'WOMEN', url: '/women' },
                { label: 'MEN', url: '/men' },
                { label: 'COLLECTIONS', url: '/collections' },
            ],
        }),
        defineField({
            name: 'announcementBar',
            title: 'Announcement Bar',
            type: 'object',
            fields: [
                {
                    name: 'enabled',
                    title: 'Show Announcement Bar',
                    type: 'boolean',
                    initialValue: false,
                },
                {
                    name: 'text',
                    title: 'Announcement Text',
                    type: 'string',
                },
                {
                    name: 'link',
                    title: 'Link (Optional)',
                    type: 'string',
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'storeName',
            storeId: 'storeId',
        },
        prepare({ title, storeId }) {
            return {
                title: `Header: ${title || 'Untitled'}`,
                subtitle: `Store ID: ${storeId}`,
            }
        },
    },
})
