import { defineType, defineField } from 'sanity'

export const bannerSection = defineType({
    name: 'bannerSection',
    title: 'Banner Section',
    type: 'object',
    fields: [
        defineField({
            name: 'text',
            title: 'Banner Text',
            type: 'string',
        }),
        defineField({
            name: 'backgroundColor',
            title: 'Background Color',
            type: 'string',
            options: {
                list: [
                    { title: 'Primary', value: 'primary' },
                    { title: 'Accent', value: 'accent' },
                    { title: 'Muted', value: 'muted' },
                ],
            },
            initialValue: 'primary',
        }),
        defineField({
            name: 'ctaText',
            title: 'Button Text (Optional)',
            type: 'string',
        }),
        defineField({
            name: 'ctaLink',
            title: 'Button Link',
            type: 'string',
        }),
    ],
    preview: {
        select: {
            title: 'text',
            bgColor: 'backgroundColor',
        },
        prepare({ title, bgColor }) {
            return {
                title: title || 'Banner',
                subtitle: `Background: ${bgColor}`,
            }
        },
    },
})
