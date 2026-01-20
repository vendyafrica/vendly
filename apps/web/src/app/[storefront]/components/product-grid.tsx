import { ProductCard } from './product-card';

const products = [
    {
        id: 1,
        title: "Classic Trench Coat",
        slug: "classic-trench-coat",
        price: "$299.00",
        image: "/images/trench-coat.png",
        rating: 4.8
    },
    {
        id: 2,
        title: "Navy Heritage Blazer",
        slug: "navy-heritage-blazer",
        price: "$249.00",
        image: "/images/navy-blazer.png",
        rating: 4.9
    },
    {
        id: 3,
        title: "Penny Loafers",
        slug: "penny-loafers",
        price: "$189.00",
        image: "/images/leather-loafers.png",
        rating: 4.7
    },
    {
        id: 4,
        title: "Premium Linen Shirt",
        slug: "premium-linen-shirt",
        price: "$89.00",
        image: "/images/linen-shirt.png",
        rating: 4.6
    },
    {
        id: 5,
        title: "Cable Knit Sweater",
        slug: "cable-knit-sweater",
        price: "$129.00",
        image: "/images/cable-knit-sweater.png",
        rating: 4.8
    },
    {
        id: 6,
        title: "Tortoiseshell Shades",
        slug: "tortoiseshell-shades",
        price: "$159.00",
        image: "/images/tortoiseshell-sunglasses.png",
        rating: 4.5
    },
    {
        id: 7,
        title: "Premium Linen Shirt Blue",
        slug: "premium-linen-shirt-blue",
        price: "$89.00",
        image: "/images/linen-shirt.png",
        rating: 4.6
    },
    {
        id: 8,
        title: "Premium Linen Shirt White",
        slug: "premium-linen-shirt-white",
        price: "$89.00",
        image: "/images/linen-shirt.png",
        rating: 4.6
    }
];

export function ProductGrid() {
    return (
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5 px-3 sm:px-4 lg:px-6 [column-fill:balance]">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    index={index}
                    {...product}
                />
            ))}
        </div>
    );
}