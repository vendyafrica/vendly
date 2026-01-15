import { client } from './src/sanity/client'

const designSystems = [
    {
        _type: 'designSystem',
        _id: 'design-system-modern',
        name: 'Modern',
        slug: { current: 'modern' },
        description: 'Clean, minimal design with neutral grays and blue accents. Perfect for contemporary brands.',
        colors: {
            primary: { hex: '#0f172a' },
            secondary: { hex: '#475569' },
            background: { hex: '#ffffff' },
            foreground: { hex: '#0f172a' },
            accent: { hex: '#3b82f6' },
            muted: { hex: '#f1f5f9' },
            mutedForeground: { hex: '#64748b' },
            border: { hex: '#e2e8f0' },
        },
        typography: {
            headingFont: 'Inter, sans-serif',
            bodyFont: 'Inter, sans-serif',
            baseFontSize: 16,
        },
        layout: {
            borderRadius: 'medium',
            spacing: 'normal',
            containerWidth: 'normal',
        },
    },
    {
        _type: 'designSystem',
        _id: 'design-system-classic',
        name: 'Classic',
        slug: { current: 'classic' },
        description: 'Elegant, timeless design with warm neutrals and gold accents. Ideal for luxury and heritage brands.',
        colors: {
            primary: { hex: '#1c1917' },
            secondary: { hex: '#78716c' },
            background: { hex: '#fafaf9' },
            foreground: { hex: '#1c1917' },
            accent: { hex: '#b45309' },
            muted: { hex: '#f5f5f4' },
            mutedForeground: { hex: '#a8a29e' },
            border: { hex: '#e7e5e4' },
        },
        typography: {
            headingFont: 'Playfair Display, serif',
            bodyFont: 'Lato, sans-serif',
            baseFontSize: 16,
        },
        layout: {
            borderRadius: 'small',
            spacing: 'normal',
            containerWidth: 'normal',
        },
    },
    {
        _type: 'designSystem',
        _id: 'design-system-bold',
        name: 'Bold',
        slug: { current: 'bold' },
        description: 'Energetic, youthful design with high contrast and vibrant accents. Great for modern, dynamic brands.',
        colors: {
            primary: { hex: '#18181b' },
            secondary: { hex: '#71717a' },
            background: { hex: '#ffffff' },
            foreground: { hex: '#18181b' },
            accent: { hex: '#dc2626' },
            muted: { hex: '#f4f4f5' },
            mutedForeground: { hex: '#a1a1aa' },
            border: { hex: '#e4e4e7' },
        },
        typography: {
            headingFont: 'Outfit, sans-serif',
            bodyFont: 'DM Sans, sans-serif',
            baseFontSize: 16,
        },
        layout: {
            borderRadius: 'full',
            spacing: 'relaxed',
            containerWidth: 'normal',
        },
    },
]

async function seedDesignSystems() {
    console.log('🌱 Seeding design systems...')

    try {
        for (const designSystem of designSystems) {
            console.log(`Creating ${designSystem.name} design system...`)
            await client.createOrReplace(designSystem)
            console.log(`✅ ${designSystem.name} created`)
        }

        console.log('\n✨ All design systems seeded successfully!')
    } catch (error) {
        console.error('❌ Error seeding design systems:', error)
        process.exit(1)
    }
}

seedDesignSystems()
