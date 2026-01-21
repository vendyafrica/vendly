"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Upload04Icon, InstagramIcon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
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
                    <Button {...props} className="gap-2">
                        <HugeiconsIcon icon={Add01Icon} className="size-4" />
                        Add Products
                        <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />
                    </Button>
                )}
            />
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onUploadClick}>
                    <HugeiconsIcon icon={Upload04Icon} className="size-4" />
                    Upload Images
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onManualClick}>
                    <HugeiconsIcon icon={Add01Icon} className="size-4" />
                    Add Manually
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onInstagramClick} className="opacity-50">
                    <HugeiconsIcon icon={InstagramIcon} className="size-4" />
                    Import from Instagram
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
