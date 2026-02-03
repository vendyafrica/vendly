import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag02Icon } from "@hugeicons/core-free-icons";

interface CartButtonProps {
    itemCount: number;
    mobile?: boolean;
}

export function CartButton({ itemCount, mobile = false }: CartButtonProps) {
    if (mobile) {
        return (
            <Link
                href="/cart"
                aria-label="Cart"
                className="relative p-2 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 active:scale-95 transition-all"
            >
                <HugeiconsIcon icon={ShoppingBag02Icon} size={22} />
                {itemCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground ring-2 ring-white">
                        {itemCount > 9 ? "9+" : itemCount}
                    </span>
                )}
            </Link>
        );
    }

    return (
        <Link
            href="/cart"
            className="group relative p-2.5 rounded-full hover:bg-neutral-100 active:scale-95 transition-all"
            aria-label="Cart"
        >
            <HugeiconsIcon icon={ShoppingBag02Icon} size={22} />
            {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white ring-2 ring-white animate-in zoom-in-50 duration-200">
                    {itemCount > 99 ? "99+" : itemCount}
                </span>
            )}
        </Link>
    );
}
