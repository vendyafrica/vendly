import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon, Search01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { useState } from "react";

// Define the shape of the header data coming from Sanity
export interface HeaderData {
    storeName?: string;
    logo?: any;
    navigationLinks?: Array<{ _key: string; label: string; url: string }>;
    announcementBar?: { enabled: boolean; text: string };
}

export default function Header({ data }: { data: HeaderData }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!data) return null;

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
            {/* Announcement Bar */}
            {data.announcementBar?.enabled && (
                <div className="bg-black text-white text-xs py-2 text-center px-4">
                    {data.announcementBar.text}
                </div>
            )}

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <HugeiconsIcon icon={Menu01Icon} size={24} />
                    </Button>
                </div>

                {/* Logo / Store Name */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        {data.storeName || "Store"}
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {data.navigationLinks?.map((link) => (
                        <Link
                            key={link._key}
                            href={link.url}
                            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <HugeiconsIcon icon={Search01Icon} size={20} />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <HugeiconsIcon icon={ShoppingCart01Icon} size={20} />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 py-4 px-6 flex flex-col gap-4 shadow-lg">
                    {data.navigationLinks?.map((link) => (
                        <Link
                            key={link._key}
                            href={link.url}
                            className="text-base font-medium text-gray-700 py-2 block"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
