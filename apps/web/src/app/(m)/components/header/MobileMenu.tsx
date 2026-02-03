"use client";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    PackageIcon,
    Settings02Icon,
    Logout03Icon,
    Cancel01Icon,
    FavouriteIcon,
    ArrowRight01Icon,
    UserCircleIcon,
} from "@hugeicons/core-free-icons";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@vendly/ui/components/avatar";
import { Portal } from "@/components/portal";
import { MenuItem } from "./MenuItem";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    session: any;
    showSellButton: boolean;
    onSellNow: () => void;
    onShowLogin: () => void;
    onSignOut: () => void;
}

export function MobileMenu({
    isOpen,
    onClose,
    session,
    showSellButton,
    onSellNow,
    onShowLogin,
    onSignOut,
}: MobileMenuProps) {
    const isSignedIn = !!session;

    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl animate-in slide-in-from-left duration-300">
                    {/* Menu Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
                        <div className="flex items-center gap-2.5">
                            <Image
                                src="/vendly.png"
                                alt="Vendly"
                                width={32}
                                height={32}
                            />
                            <span className="text-lg font-semibold tracking-tight">
                                vendly
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-neutral-100 active:scale-95 transition-all"
                            aria-label="Close menu"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={24} />
                        </button>
                    </div>

                    {/* Menu Content */}
                    <div className="p-4 space-y-1">
                        {/* User Section */}
                        {isSignedIn && session?.user && (
                            <div className="mb-6 px-3 py-4 rounded-xl bg-neutral-50 border border-neutral-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={session.user.image || ""} />
                                        <AvatarFallback className="bg-neutral-900 text-white font-medium">
                                            {session.user.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        {session?.user?.name && (
                                            <p className="font-semibold text-sm leading-tight">
                                                {session.user.name}
                                            </p>
                                        )}
                                        {session?.user?.email && (
                                            <p className="text-xs text-neutral-500 leading-tight truncate mt-1">
                                                {session.user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href="/account/orders"
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50 active:scale-95 transition-all"
                                        onClick={onClose}
                                    >
                                        <HugeiconsIcon icon={PackageIcon} size={14} />
                                        Orders
                                    </Link>
                                    <Link
                                        href="/account/settings"
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50 active:scale-95 transition-all"
                                        onClick={onClose}
                                    >
                                        <HugeiconsIcon icon={Settings02Icon} size={14} />
                                        Settings
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Menu Items */}
                        <MenuItem
                            icon={FavouriteIcon}
                            label="Wishlist"
                            href="/wishlist"
                            onClick={onClose}
                            delay={0}
                        />

                        {showSellButton && (
                            <MenuItem
                                icon={ArrowRight01Icon}
                                label="Sell now"
                                onClick={() => {
                                    onSellNow();
                                    onClose();
                                }}
                                delay={50}
                                highlight
                            />
                        )}

                        {!isSignedIn && (
                            <MenuItem
                                icon={UserCircleIcon}
                                label="Sign in"
                                onClick={() => {
                                    onClose();
                                    onShowLogin();
                                }}
                                delay={100}
                            />
                        )}

                        <MenuItem
                            label="Contact us"
                            href="/contact"
                            onClick={onClose}
                            delay={150}
                        />

                        {isSignedIn && (
                            <>
                                <div className="h-px bg-neutral-200 my-4" />
                                <MenuItem
                                    icon={Logout03Icon}
                                    label="Sign out"
                                    onClick={() => {
                                        onSignOut();
                                        onClose();
                                    }}
                                    danger
                                    delay={200}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    );
}
