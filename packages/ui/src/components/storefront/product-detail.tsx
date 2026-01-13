import * as React from "react";
import { cn } from "../../lib/utils";
import Image from "next/image";
import { Star, Plus, Minus } from "lucide-react";

interface ProductDetailProps {
  layout: "split" | "stacked";
  showGallery: boolean;
  showVariants: boolean;
  showReviews: boolean;
  showRelatedProducts: boolean;
  galleryStyle: "grid" | "carousel";
  backgroundColor?: string;
  padding?: string;
}

const mockProduct = {
  id: "1",
  name: "Premium Cotton T-Shirt",
  price: 2999,
  originalPrice: 3999,
  rating: 4.5,
  reviewCount: 128,
  description: "Made from 100% organic cotton, this premium t-shirt offers exceptional comfort and durability. Perfect for everyday wear with a modern fit that flatters all body types.",
  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
  ],
  variants: {
    size: ["XS", "S", "M", "L", "XL"],
    color: ["Black", "White", "Navy", "Gray"]
  }
};

export function ProductDetail({
  layout,
  showGallery,
  showVariants,
  showReviews,
  showRelatedProducts,
  galleryStyle,
  backgroundColor,
  padding
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState("M");
  const [selectedColor, setSelectedColor] = React.useState("Black");
  const [quantity, setQuantity] = React.useState(1);

  const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;

  return (
    <section 
      className={cn("w-full", padding || "py-16")}
      style={{ backgroundColor: backgroundColor || "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className={cn(
          "grid gap-12",
          layout === "split" ? "lg:grid-cols-2" : "grid-cols-1"
        )}>
          
          {/* Product Gallery */}
          {showGallery && (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <Image
                  src={mockProduct.images[selectedImage]}
                  alt={mockProduct.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {galleryStyle === "grid" && (
                <div className="grid grid-cols-3 gap-4">
                  {mockProduct.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors",
                        selectedImage === index ? "border-black" : "border-transparent hover:border-gray-300"
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${mockProduct.name} ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading, inherit)" }}>
                {mockProduct.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(mockProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {mockProduct.rating} ({mockProduct.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{formatPrice(mockProduct.price)}</span>
                {mockProduct.originalPrice > mockProduct.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(mockProduct.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {mockProduct.description}
            </p>

            {/* Variants */}
            {showVariants && (
              <div className="space-y-6">
                {/* Size Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Size</h3>
                  <div className="flex gap-2">
                    {mockProduct.variants.size.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 border rounded-lg font-medium transition-colors",
                          selectedSize === size 
                            ? "border-black bg-black text-white" 
                            : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
                  <div className="flex gap-2">
                    {mockProduct.variants.color.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-4 py-2 border rounded-lg font-medium transition-colors",
                          selectedColor === color 
                            ? "border-black bg-black text-white" 
                            : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-3 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button className="flex-1 bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {showReviews && (
          <div className="mt-16 pt-16 border-t">
            <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-medium">John D.</span>
                  </div>
                  <p className="text-gray-600">Great quality and comfortable fit. Highly recommend!</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {showRelatedProducts && (
          <div className="mt-16 pt-16 border-t">
            <h2 className="text-2xl font-bold mb-8">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((product) => (
                <div key={product} className="group">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80"
                      alt="Related product"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium mb-2">Related Product {product}</h3>
                  <p className="text-gray-600">$29.99</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
