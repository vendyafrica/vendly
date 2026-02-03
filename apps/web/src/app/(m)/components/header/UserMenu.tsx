"use client";

import Link from "next/link";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    PackageIcon,
    Settings02Icon,
    Logout03Icon,
} from "@hugeicons/core-free-icons";
import { signOut } from "@vendly/auth/react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@vendly/ui/components/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu";
import { useRouter } from "next/navigation";

interface UserMenuProps {
    session: any;
    tenantStatus: {
        hasTenant: boolean;
        isTenantAdmin?: boolean | null;
        adminStoreSlug?: string | null;
        tenantSlug?: string | null;
    } | null;
    onShowLogin: () => void;
}

export function UserMenu({ session, tenantStatus, onShowLogin }: UserMenuProps) {
    const router = useRouter();
    const isSignedIn = !!session;
    const adminStoreSlug = tenantStatus?.adminStoreSlug ?? null;
    const isTenantAdmin = !!tenantStatus?.isTenantAdmin && !!adminStoreSlug;

    const handleSignOut = async () => {
        await signOut();
        router.refresh();
    };

    if (!isSignedIn) {
        return (
            <Button
                onClick={onShowLogin}
                className="group flex items-center gap-2 px-5 py-2.5 hover:text-primary h-auto active:scale-95 transition-all"
                aria-label="Sign in"
                variant="ghost"
            >
                Sign in
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 ring-black rounded-full">
                <div className="group p-0.5 rounded-full hover:bg-neutral-100 active:scale-95 transition-all">
                    <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-neutral-200 transition-colors">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-neutral-900 text-white text-sm font-medium">
                            {session?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-64 p-2 mt-2 animate-in fade-in-0 zoom-in-95 duration-200 bg-white text-neutral-900 border border-neutral-200 shadow-xl"
            >
                <div className="flex items-center gap-3 px-3 py-3 mb-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-neutral-900 text-white font-medium">
                            {session?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                        {session?.user?.name && (
                            <p className="font-semibold text-sm leading-none">
                                {session.user.name}
                            </p>
                        )}
                        {session?.user?.email && (
                            <p className="text-xs text-neutral-500 leading-none truncate max-w-[180px]">
                                {session.user.email}
                            </p>
                        )}
                    </div>
                </div>
                <div className="h-px bg-neutral-100 mb-2" />
                {isTenantAdmin && adminStoreSlug && (
                    <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2.5 hover:bg-primary/10 focus:bg-primary/10 hover:text-primary focus:text-primary">
                        <Link
                            href={`/a/${adminStoreSlug}`}
                            className="w-full flex items-center gap-3"
                        >
                            <HugeiconsIcon
                                icon={Settings02Icon}
                                size={18}
                                className="text-neutral-500"
                            />
                            <span className="font-medium text-sm">
                                Admin panel
                            </span>
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2.5 hover:bg-primary/10 focus:bg-primary/10 hover:text-primary focus:text-primary">
                    <Link
                        href="/account/orders"
                        className="w-full flex items-center gap-3"
                    >
                        <HugeiconsIcon
                            icon={PackageIcon}
                            size={18}
                            className="text-neutral-500"
                        />
                        <span className="font-medium text-sm">My Orders</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2.5 hover:bg-primary/10 focus:bg-primary/10 hover:text-primary focus:text-primary">
                    <Link
                        href="/account/settings"
                        className="w-full flex items-center gap-3"
                    >
                        <HugeiconsIcon
                            icon={Settings02Icon}
                            size={18}
                            className="text-neutral-500"
                        />
                        <span className="font-medium text-sm">Settings</span>
                    </Link>
                </DropdownMenuItem>
                <div className="h-px bg-neutral-100 my-2" />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-md px-3 py-2.5 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                >
                    <div className="w-full flex items-center gap-3">
                        <HugeiconsIcon icon={Logout03Icon} size={18} />
                        <span className="font-medium text-sm">Sign out</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
