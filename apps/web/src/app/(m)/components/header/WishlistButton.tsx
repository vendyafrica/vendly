import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";

export function WishlistButton() {
    return (
        <Link
            href="/wishlist"
            className="group relative p-2.5 rounded-full hover:bg-neutral-100 active:scale-95 transition-all"
            aria-label="Wishlist"
        >
            <HugeiconsIcon
                icon={FavouriteIcon}
                size={22}
                className="text-neutral-700 group-hover:text-black transition-colors"
            />
        </Link>
    );
}
