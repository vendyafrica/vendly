import { defineType, defineField } from 'sanity'

export const productGridSection = defineType({
    name: 'productGridSection',
    title: 'Product Grid Section',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Section Title',
            type: 'string',
            initialValue: 'Featured Products',
        }),
        defineField({
            name: 'columns',
            title: 'Number of Columns',
            type: 'number',
            options: {
                list: [2, 3, 4, 6],
            },
            initialValue: 4,
        }),
        defineField({
            name: 'productSource',
            title: 'Product Source',
            type: 'string',
            options: {
                list: [
                    { title: 'Featured Products', value: 'featured' },
                    { title: 'New Arrivals', value: 'new' },
                    { title: 'Best Sellers', value: 'bestsellers' },
                    { title: 'All Products', value: 'all' },
                ],
            },
            initialValue: 'featured',
        }),
        defineField({
            name: 'limit',
            title: 'Number of Products to Show',
            type: 'number',
            initialValue: 8,
            validation: (Rule) => Rule.min(1).max(24),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            columns: 'columns',
            source: 'productSource',
        },
        prepare({ title, columns, source }) {
            return {
                title: title || 'Product Grid',
                subtitle: `${columns} columns • ${source}`,
            }
        },
    },
})
