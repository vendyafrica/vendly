const { createClient } = require('@sanity/client');
require('dotenv').config();

const storeSlug = 'acme';
const storeName = 'Acme Store';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yiuv19n6',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false
});

async function seedAcmeStore() {
    console.log('🌱 Seeding Sanity with test data for:', storeSlug);

    const defaultDesignSystem = {
        _type: 'designSystem',
        _id: 'designSystem-default',
        name: 'Default Theme',
        slug: { current: 'default' },
        colors: {
            primary: '#000000',
            secondary: '#666666',
            accent: '#0066cc',
            background: '#ffffff',
            text: '#000000'
        },
        typography: {
            fontFamily: 'Inter, system-ui, sans-serif',
            headingFontFamily: 'Inter, system-ui, sans-serif'
        },
        layout: {
            borderRadius: 4,
            spacing: 16
        }
    };

    const documents = [
        defaultDesignSystem,
        {
            _type: 'storeSettings',
            _id: `storeSettings-${storeSlug}`,
            storeId: storeSlug,
            storeName: storeName,
            currency: 'USD',
            designSystem: {
                _type: 'reference',
                _ref: 'designSystem-default'
            }
        },
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
                    _type: 'bannerSection',
                    _key: 'banner1',
                    text: 'Free shipping on all international orders!',
                    backgroundColor: '#000000'
                }
            ]
        }
    ];

    const transaction = client.transaction();

    documents.forEach(doc => {
        transaction.createOrReplace(doc);
    });

    await transaction.commit();

    console.log('✅ Successfully seeded Sanity with test data!');
    console.log('📍 You can now access the store at: http://acme.localhost:3000');
}

seedAcmeStore()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    });
