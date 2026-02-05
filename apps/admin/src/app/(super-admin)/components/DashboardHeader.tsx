"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";

export function DashboardHeader({
    title = "Dashboard",
    user
}: {
    title?: string;
    user?: {
        name?: string | null;
        image?: string | null;
        email?: string | null;
    }
}) {
    const fullName = user?.name || "Admin";
    const firstName = fullName.split(" ")[0];
    const avatarUrl = user?.image || "";

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex items-center gap-2">
                    <h1 className="truncate text-base font-semibold text-foreground">{title}</h1>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-muted-foreground/40">|</span>
                    <span className="font-semibold text-muted-foreground">Welcome back, {firstName}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-sm" className="rounded-full">
                    <HugeiconsIcon icon={Notification01Icon} className="size-4" />
                    <span className="sr-only">Notifications</span>
                </Button>

                <Avatar className="h-7 w-7">
                    <AvatarImage src={avatarUrl} alt={fullName} />
                    <AvatarFallback className="text-xs font-semibold">
                        {firstName.charAt(0) || "A"}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
