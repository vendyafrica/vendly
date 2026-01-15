import { defineType, defineField } from 'sanity'

export const heroSection = defineType({
    name: 'heroSection',
    title: 'Hero Section',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'backgroundImage',
            title: 'Background Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'ctaText',
            title: 'Button Text',
            type: 'string',
        }),
        defineField({
            name: 'ctaLink',
            title: 'Button Link',
            type: 'string',
        }),
        defineField({
            name: 'layout',
            title: 'Layout Style',
            type: 'string',
            options: {
                list: [
                    { title: 'Centered', value: 'centered' },
                    { title: 'Split Screen', value: 'split' },
                    { title: 'Full Width', value: 'fullwidth' },
                ],
            },
            initialValue: 'centered',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'subtitle',
            media: 'backgroundImage',
        },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Hero Section',
                subtitle: subtitle || 'No subtitle',
                media,
            }
        },
    },
})
