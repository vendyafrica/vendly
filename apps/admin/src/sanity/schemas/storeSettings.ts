import { defineType, defineField } from 'sanity'

export const storeSettings = defineType({
    name: 'storeSettings',
    title: 'Store Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'storeId',
            title: 'Store ID',
            type: 'string',
            validation: (Rule) => Rule.required(),
            readOnly: true,
        }),
        defineField({
            name: 'storeName',
            title: 'Store Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'designSystem',
            title: 'Design System',
            type: 'reference',
            to: [{ type: 'designSystem' }],
            validation: (Rule) => Rule.required(),
            description: 'Choose a design system for your store',
        }),
        defineField({
            name: 'logo',
            title: 'Store Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'favicon',
            title: 'Favicon',
            type: 'image',
            description: 'Small icon shown in browser tabs',
        }),
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'object',
            fields: [
                {
                    name: 'title',
                    title: 'Site Title',
                    type: 'string',
                },
                {
                    name: 'description',
                    title: 'Site Description',
                    type: 'text',
                    rows: 3,
                },
                {
                    name: 'keywords',
                    title: 'Keywords',
                    type: 'array',
                    of: [{ type: 'string' }],
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'storeName',
            storeId: 'storeId',
            media: 'logo',
        },
        prepare({ title, storeId, media }) {
            return {
                title: title || 'Untitled Store',
                subtitle: `ID: ${storeId}`,
                media,
            }
        },
    },
})
