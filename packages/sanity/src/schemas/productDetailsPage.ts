import { defineType, defineField } from 'sanity'

export const productDetailsPage = defineType({
    name: 'productDetailsPage',
    title: 'Product Details Page',
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
            name: 'galleryStyle',
            title: 'Image Gallery Style',
            type: 'string',
            options: {
                list: [
                    { title: 'Grid', value: 'grid' },
                    { title: 'Slider', value: 'slider' },
                    { title: 'Stacked', value: 'stacked' },
                ],
            },
            initialValue: 'grid',
        }),
        defineField({
            name: 'descriptionLocation',
            title: 'Description Location',
            type: 'string',
            options: {
                list: [
                    { title: 'Right Column (with price)', value: 'sidebar' },
                    { title: 'Full Width (below images)', value: 'bottom' },
                ],
            },
            initialValue: 'sidebar',
        }),
        defineField({
            name: 'showRelatedProducts',
            title: 'Show Related Products',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            storeId: 'storeId',
        },
        prepare({ storeId }) {
            return {
                title: 'Product Details Page Layout',
                subtitle: `Store ID: ${storeId}`,
            }
        },
    },
})
