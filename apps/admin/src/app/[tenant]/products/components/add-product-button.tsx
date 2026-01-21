"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Upload02Icon, InstagramIcon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu";
import { Button } from "@vendly/ui/components/button";

interface AddProductButtonProps {
    onUploadClick: () => void;
    onManualClick?: () => void;
    onInstagramClick?: () => void;
}

export function AddProductButton({
    onUploadClick,
    onManualClick,
    onInstagramClick,
}: AddProductButtonProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                nativeButton={false}
                render={(props) => (
                    <Button
                        {...props}
                        className="rounded-lg border border-border/70 bg-primary text-background shadow-sm hover:bg-primary/90"
                    >
                        <HugeiconsIcon icon={Add01Icon} className="size-4" />
                        Add Products
                    </Button>
                )}
            />
            <DropdownMenuContent align="end" className="w-52 p-4 m-3 ">
                <DropdownMenuItem onClick={onUploadClick} className="cursor-pointer p-2">
                    <HugeiconsIcon icon={Upload02Icon} className="size-4 " />
                    Upload Images
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onInstagramClick} className="cursor-pointer p-1">
                    <HugeiconsIcon icon={InstagramIcon} className="size-4" />
                    Import from Instagram
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
