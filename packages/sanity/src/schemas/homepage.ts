import { defineType, defineField } from 'sanity'

export const homepage = defineType({
    name: 'homepage',
    title: 'Homepage',
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
            name: 'title',
            title: 'Page Title',
            type: 'string',
            initialValue: 'Homepage',
        }),
        defineField({
            name: 'sections',
            title: 'Page Sections',
            type: 'array',
            of: [
                { type: 'heroSection' },
                { type: 'collectionsSection' },
                { type: 'productGridSection' },
                { type: 'offersSection' },
                { type: 'bannerSection' },
            ],
            description: 'Add, remove, and reorder sections to build your homepage',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            storeId: 'storeId',
            sections: 'sections',
        },
        prepare({ title, storeId, sections }) {
            return {
                title: title || 'Homepage',
                subtitle: `Store: ${storeId} • ${sections?.length || 0} sections`,
            }
        },
    },
})
