import { defineType, defineField } from 'sanity'

export const designSystem = defineType({
    name: 'designSystem',
    title: 'Design System',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'preview',
            title: 'Preview Image',
            type: 'image',
            description: 'Preview image showing this design system',
        }),
        defineField({
            name: 'colors',
            title: 'Colors',
            type: 'object',
            fields: [
                {
                    name: 'primary',
                    title: 'Primary',
                    type: 'color',
                },
                {
                    name: 'secondary',
                    title: 'Secondary',
                    type: 'color',
                },
                {
                    name: 'background',
                    title: 'Background',
                    type: 'color',
                },
                {
                    name: 'foreground',
                    title: 'Foreground',
                    type: 'color',
                },
                {
                    name: 'accent',
                    title: 'Accent',
                    type: 'color',
                },
                {
                    name: 'muted',
                    title: 'Muted',
                    type: 'color',
                },
                {
                    name: 'mutedForeground',
                    title: 'Muted Foreground',
                    type: 'color',
                },
                {
                    name: 'border',
                    title: 'Border',
                    type: 'color',
                },
            ],
        }),
        defineField({
            name: 'typography',
            title: 'Typography',
            type: 'object',
            fields: [
                {
                    name: 'headingFont',
                    title: 'Heading Font',
                    type: 'string',
                    description: 'Google Font name or system font stack',
                },
                {
                    name: 'bodyFont',
                    title: 'Body Font',
                    type: 'string',
                    description: 'Google Font name or system font stack',
                },
                {
                    name: 'baseFontSize',
                    title: 'Base Font Size (px)',
                    type: 'number',
                    initialValue: 16,
                },
            ],
        }),
        defineField({
            name: 'layout',
            title: 'Layout',
            type: 'object',
            fields: [
                {
                    name: 'borderRadius',
                    title: 'Border Radius',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'None (0px)', value: 'none' },
                            { title: 'Small (0.2rem)', value: 'small' },
                            { title: 'Medium (0.5rem)', value: 'medium' },
                            { title: 'Large (1rem)', value: 'large' },
                            { title: 'Full (Pill)', value: 'full' },
                        ],
                    },
                    initialValue: 'medium',
                },
                {
                    name: 'spacing',
                    title: 'Spacing Scale',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Compact', value: 'compact' },
                            { title: 'Normal', value: 'normal' },
                            { title: 'Relaxed', value: 'relaxed' },
                        ],
                    },
                    initialValue: 'normal',
                },
                {
                    name: 'containerWidth',
                    title: 'Container Width',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Narrow (800px)', value: 'narrow' },
                            { title: 'Normal (1200px)', value: 'normal' },
                            { title: 'Wide (1400px)', value: 'wide' },
                            { title: 'Full Width', value: 'full' },
                        ],
                    },
                    initialValue: 'normal',
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'description',
            media: 'preview',
        },
    },
})
