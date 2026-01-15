import { defineType, defineField } from 'sanity'

export const collectionsSection = defineType({
    name: 'collectionsSection',
    title: 'Collections Section',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Section Title',
            type: 'string',
            initialValue: 'Shop by Collection',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'collections',
            title: 'Collections',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Collection Title',
                            type: 'string',
                        },
                        {
                            name: 'image',
                            title: 'Collection Image',
                            type: 'image',
                            options: {
                                hotspot: true,
                            },
                        },
                        {
                            name: 'link',
                            title: 'Link URL',
                            type: 'string',
                        },
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            media: 'image',
                        },
                    },
                },
            ],
            validation: (Rule) => Rule.max(4),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            collections: 'collections',
        },
        prepare({ title, collections }) {
            return {
                title: title || 'Collections Section',
                subtitle: `${collections?.length || 0} collections`,
            }
        },
    },
})
