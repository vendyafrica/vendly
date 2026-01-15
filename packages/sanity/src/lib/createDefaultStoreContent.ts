import { client } from '../client' // Uses the default client from our package

interface CreateStoreContentParams {
    storeSlug: string
    storeName: string
}

export async function createDefaultStoreContent({ storeSlug, storeName }: CreateStoreContentParams) {
    const documents: any[] = [
        // Store Settings
        {
            _type: 'storeSettings',
            _id: `storeSettings-${storeSlug}`,
            storeId: storeSlug,
            storeName: storeName,
            currency: 'USD',
            designSystem: {
                _type: 'reference',
                _ref: 'designSystem-default' // Assuming a default exists, otherwise we might need to create one or embed it
            }
        },
        // Header
        {
            _type: 'header',
            _id: `header-${storeSlug}`,
            storeId: storeSlug,
            storeName: storeName,
            navigationLinks: [
                { _key: '1', label: 'Home', url: '/' },
                { _key: '2', label: 'Collections', url: '/collections' },
                { _key: '3', label: 'Offers', url: '/offers' },
            ],
            announcementBar: {
                enabled: true,
                text: 'Welcome to our new store! Free shipping on orders over $50.'
            }
        },
        // Footer
        {
            _type: 'footer',
            _id: `footer-${storeSlug}`,
            storeId: storeSlug,
            linkColumns: [
                {
                    _key: '1',
                    title: 'Shop',
                    links: [
                        { _key: '1', label: 'All Products', url: '/products' },
                        { _key: '2', label: 'New Arrivals', url: '/products?sort=new' },
                    ]
                },
                {
                    _key: '2',
                    title: 'Support',
                    links: [
                        { _key: '1', label: 'Contact Us', url: '/contact' },
                        { _key: '2', label: 'FAQs', url: '/faqs' },
                    ]
                }
            ],
            copyrightText: `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`
        },
        // Homepage
        {
            _type: 'homepage',
            _id: `homepage-${storeSlug}`,
            storeId: storeSlug,
            title: 'Home',
            sections: [
                {
                    _type: 'heroSection',
                    _key: 'hero1',
                    title: `Welcome to ${storeName}`,
                    subtitle: 'Discover our premium collection of products designed just for you.',
                    ctaText: 'Shop Now',
                    ctaLink: '/collections',
                    layout: 'centered'
                },
                {
                    _type: 'collectionsSection',
                    _key: 'collections1',
                    title: 'Shop by Category',
                    description: 'Explore our wide range of collections.',
                    collections: [
                        { _key: 'c1', title: 'New Arrivals', link: '/collections/new' },
                        { _key: 'c2', title: 'Best Sellers', link: '/collections/best-sellers' }
                    ]
                },
                {
                    _type: 'productGridSection',
                    _key: 'grid1',
                    title: 'Featured Products',
                    columns: 4,
                    limit: 8,
                    productSource: 'featured'
                },
                {
                    _type: 'offersSection',
                    _key: 'offers1',
                    title: 'Special Deals',
                    offers: [
                        {
                            _key: 'o1',
                            heading: 'Summer Sale',
                            text: 'Up to 50% off on selected items.',
                            ctaText: 'View Offers',
                            ctaLink: '/offers'
                        }
                    ]
                },
                {
                    _type: 'bannerSection',
                    _key: 'banner1',
                    text: 'Free shipping on all international orders!',
                    backgroundColor: 'primary'
                }
            ]
        },
        // Product Details Page Configuration
        {
            _type: 'productDetailsPage',
            _id: `productDetailsPage-${storeSlug}`,
            storeId: storeSlug,
            galleryStyle: 'grid',
            descriptionLocation: 'sidebar',
            showRelatedProducts: true
        }
    ]

    const transaction = client.transaction()

    documents.forEach(doc => {
        transaction.createOrReplace(doc)
    })

    await transaction.commit()

    return { success: true, documents }
}
