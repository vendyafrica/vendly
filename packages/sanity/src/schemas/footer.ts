import { defineType, defineField } from 'sanity'

export const footer = defineType({
    name: 'footer',
    title: 'Footer',
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
            name: 'linkColumns',
            title: 'Link Columns',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Column Title',
                            type: 'string',
                        },
                        {
                            name: 'links',
                            title: 'Links',
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
                        },
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            links: 'links',
                        },
                        prepare({ title, links }) {
                            return {
                                title: title || 'Untitled Column',
                                subtitle: `${links?.length || 0} links`,
                            }
                        },
                    },
                },
            ],
            initialValue: [
                {
                    title: 'Categories',
                    links: [
                        { label: 'Women', url: '/women' },
                        { label: 'Men', url: '/men' },
                        { label: 'Collections', url: '/collections' },
                    ],
                },
                {
                    title: 'Customer Service',
                    links: [
                        { label: 'Orders', url: '/orders' },
                        { label: 'Shipment', url: '/shipment' },
                        { label: 'Offers', url: '/offers' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'newsletter',
            title: 'Newsletter Section',
            type: 'object',
            fields: [
                {
                    name: 'enabled',
                    title: 'Show Newsletter Signup',
                    type: 'boolean',
                    initialValue: true,
                },
                {
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                    initialValue: 'Stay Updated',
                },
                {
                    name: 'description',
                    title: 'Description',
                    type: 'text',
                    initialValue: 'Subscribe to our newsletter for exclusive offers and updates',
                },
            ],
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Media Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'platform',
                            title: 'Platform',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Facebook', value: 'facebook' },
                                    { title: 'Instagram', value: 'instagram' },
                                    { title: 'Twitter', value: 'twitter' },
                                    { title: 'LinkedIn', value: 'linkedin' },
                                    { title: 'TikTok', value: 'tiktok' },
                                ],
                            },
                        },
                        {
                            name: 'url',
                            title: 'URL',
                            type: 'url',
                        },
                    ],
                    preview: {
                        select: {
                            platform: 'platform',
                            url: 'url',
                        },
                        prepare({ platform, url }) {
                            return {
                                title: platform || 'Social Link',
                                subtitle: url,
                            }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'copyrightText',
            title: 'Copyright Text',
            type: 'string',
            initialValue: '© 2025 Vendly. All rights reserved.',
        }),
    ],
    preview: {
        select: {
            storeId: 'storeId',
        },
        prepare({ storeId }) {
            return {
                title: 'Footer',
                subtitle: `Store ID: ${storeId}`,
            }
        },
    },
})
