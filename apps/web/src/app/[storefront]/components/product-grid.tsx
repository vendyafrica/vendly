import React from 'react';
import { ProductCard } from './product-card';

const products = [
    {
        id: 1,
        title: "Classic Trench Coat",
        price: "$299.00",
        image: "/images/trench-coat.png",
        rating: 4.8
    },
    {
        id: 2,
        title: "Navy Heritage Blazer",
        price: "$249.00",
        image: "/images/navy-blazer.png",
        rating: 4.9
    },
    {
        id: 3,
        title: "Penny Loafers",
        price: "$189.00",
        image: "/images/leather-loafers.png",
        rating: 4.7
    },
    {
        id: 4,
        title: "Premium Linen Shirt",
        price: "$89.00",
        image: "/images/linen-shirt.png",
        rating: 4.6
    },
    {
        id: 5,
        title: "Cable Knit Sweater",
        price: "$129.00",
        image: "/images/cable-knit-sweater.png",
        rating: 4.8
    },
    {
        id: 6,
        title: "Tortoiseshell Shades",
        price: "$159.00",
        image: "/images/tortoiseshell-sunglasses.png",
        rating: 4.5
    },
    {
        id: 7,
        title: "Premium Linen Shirt",
        price: "$89.00",
        image: "/images/linen-shirt.png",
        rating: 4.6
    },
    {
        id: 8,
        title: "Premium Linen Shirt",
        price: "$89.00",
        image: "/images/linen-shirt.png",
        rating: 4.6
    }
];

export function ProductGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 m-8">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    image={product.image}
                    rating={product.rating}
                />
            ))}
        </div>
    );
}