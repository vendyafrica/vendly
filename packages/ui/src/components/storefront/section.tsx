import * as React from "react";
import { cn } from "../../lib/utils";

interface SectionProps {
    backgroundColor: string;
    padding: string;
    maxWidth?: "full" | "contained";
    children: React.ReactNode;
}

export function Section({ backgroundColor, padding, maxWidth = "contained", children }: SectionProps) {
    return (
        <div className={cn(backgroundColor, padding)}>
            <div className={cn(
                "mx-auto px-4 sm:px-6 lg:px-8",
                maxWidth === "contained" ? "max-w-7xl" : "w-full max-w-none"
            )}>
                {children}
            </div>
        </div>
    );
}
