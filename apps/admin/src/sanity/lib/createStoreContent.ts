import { client } from '../client'

interface CreateStoreContentParams {
    storeId: string
    storeName: string
    designSystemId?: 'design-system-modern' | 'design-system-classic' | 'design-system-bold'
}

/**
 * Creates initial Sanity content for a new store on signup
 * This should be called after a merchant completes onboarding
 */
export async function createStoreContent({
    storeId,
    storeName,
    designSystemId = 'design-system-modern', // Default to Modern
}: CreateStoreContentParams) {
    try {
        console.log(`Creating Sanity content for store: ${storeId}`)

        // 1. Create Store Settings
        await client.create({
            _type: 'storeSettings',
            storeId,
            storeName,
            designSystem: {
                _type: 'reference',
                _ref: designSystemId,
            },
            seo: {
                title: storeName,
                description: `Shop amazing products at ${storeName}`,
                keywords: ['ecommerce', 'shop', 'online store'],
            },
        })
        console.log('✅ Store Settings created')

        // 2. Create Homepage with default sections
        await client.create({
            _type: 'homepage',
            storeId,
            title: 'Homepage',
            sections: [
                {
                    _type: 'heroSection',
                    title: `Welcome to ${storeName}`,
                    subtitle: 'Discover amazing products curated just for you',
                    layout: 'centered',
                    ctaText: 'Shop Now',
                    ctaLink: '/collections',
                },
                {
                    _type: 'productGridSection',
                    title: 'Featured Products',
                    columns: 4,
                    productSource: 'featured',
                    limit: 8,
                },
                {
                    _type: 'bannerSection',
                    text: 'Free shipping on orders over $100',
                    backgroundColor: 'primary',
                    ctaText: 'Learn More',
                    ctaLink: '/shipping',
                },
            ],
        })
        console.log('✅ Homepage created')

        // 3. Create Header
        await client.create({
            _type: 'header',
            storeId,
            storeName,
            navigationLinks: [
                { label: 'WOMEN', url: '/women' },
                { label: 'MEN', url: '/men' },
                { label: 'COLLECTIONS', url: '/collections' },
            ],
            announcementBar: {
                enabled: true,
                text: 'Welcome to our store! 🎉',
                link: '/collections',
            },
        })
        console.log('✅ Header created')

        // 4. Create Footer
        await client.create({
            _type: 'footer',
            storeId,
            linkColumns: [
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
            newsletter: {
                enabled: true,
                title: 'Stay Updated',
                description: 'Subscribe to our newsletter for exclusive offers and updates',
            },
            copyrightText: `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`,
        })
        console.log('✅ Footer created')

        console.log(`\n✨ Store content created successfully for ${storeName}!`)
        return { success: true }
    } catch (error) {
        console.error('❌ Error creating store content:', error)
        throw error
    }
}

/**
 * Updates the design system for an existing store
 */
export async function updateStoreDesignSystem(
    storeId: string,
    designSystemId: 'design-system-modern' | 'design-system-classic' | 'design-system-bold'
) {
    try {
        // Find the store settings document
        const storeSettings = await client.fetch(
            `*[_type == "storeSettings" && storeId == $storeId][0]`,
            { storeId }
        )

        if (!storeSettings) {
            throw new Error(`Store settings not found for storeId: ${storeId}`)
        }

        // Update the design system reference
        await client
            .patch(storeSettings._id)
            .set({
                designSystem: {
                    _type: 'reference',
                    _ref: designSystemId,
                },
            })
            .commit()

        console.log(`✅ Design system updated to ${designSystemId}`)
        return { success: true }
    } catch (error) {
        console.error('❌ Error updating design system:', error)
        throw error
    }
}
