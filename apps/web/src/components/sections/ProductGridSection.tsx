'use client'

import ProductCard, { dummyProducts } from '@/components/marketplace/product-card'

interface ProductGridSectionProps {
    title?: string
    columns?: number
    productSource?: 'featured' | 'new' | 'bestsellers' | 'all'
    limit?: number
}

export default function ProductGridSection({
    title = 'Featured Products',
    columns = 4,
    productSource = 'featured',
    limit = 8,
}: ProductGridSectionProps) {
    // For now, use dummy products. In production, fetch from your API based on productSource
    const products = dummyProducts.slice(0, limit)

    const gridColsClass = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4',
        6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    }[columns] || 'grid-cols-2 md:grid-cols-4'

    return (
        <section className="content-container py-12 px-6">
            {title && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
                </div>
            )}
            <div className={`grid ${gridColsClass} gap-6`}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}
