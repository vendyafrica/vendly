import { defineType, defineField } from 'sanity'

export const offersSection = defineType({
    name: 'offersSection',
    title: 'Offers Section',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Section Title',
            type: 'string',
            initialValue: 'Special Offers',
        }),
        defineField({
            name: 'offers',
            title: 'Offers',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'heading',
                            title: 'Heading',
                            type: 'string',
                        },
                        {
                            name: 'text',
                            title: 'Text',
                            type: 'text',
                            rows: 2,
                        },
                        {
                            name: 'image',
                            title: 'Background Image',
                            type: 'image',
                            options: {
                                hotspot: true,
                            },
                        },
                        {
                            name: 'ctaText',
                            title: 'Button Text',
                            type: 'string',
                        },
                        {
                            name: 'ctaLink',
                            title: 'Button Link',
                            type: 'string',
                        },
                        {
                            name: 'layout',
                            title: 'Text Layout',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Left', value: 'left' },
                                    { title: 'Center', value: 'center' },
                                    { title: 'Right', value: 'right' },
                                ],
                            },
                            initialValue: 'left',
                        },
                    ],
                    preview: {
                        select: {
                            title: 'heading',
                            media: 'image',
                        },
                    },
                },
            ],
            validation: (Rule) => Rule.max(3),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            offers: 'offers',
        },
        prepare({ title, offers }) {
            return {
                title: title || 'Offers Section',
                subtitle: `${offers?.length || 0} offers`,
            }
        },
    },
})
