import { StorefrontHeader } from "../../components/header";
import { StorefrontFooter } from "../../components/footer";
import { ProductDetails } from "../../components/product-details";
import { FeaturedSection } from "../../components/featured";

export default function ProductPage() {
    return (
        <div className="min-h-screen bg-white">
            <StorefrontHeader />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <ProductDetails />

                <div className="my-24" />

                {/* You might want to replace this with a 'Related Products' section later */}
                <FeaturedSection />
            </div>

            <StorefrontFooter />
        </div>
    );
}
