import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon, WhatsappBusinessIcon } from "@hugeicons/core-free-icons";

export function Footer() {
    return (
        <footer className="w-full py-12 text-center text-white/40">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center gap-6">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Vendly Africa. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <Link href="#" className="hover:text-primary transition-colors"><HugeiconsIcon icon={InstagramIcon} /></Link>
                        <Link href="#" className="hover:text-primary transition-colors"><HugeiconsIcon icon={WhatsappBusinessIcon} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}