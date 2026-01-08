"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { Button } from "@vendly/ui/components/button";
import { X, Upload } from "lucide-react";

interface InlineEditPopoverProps {
    section: string;
    element: string;
    currentValue: string;
    rect: {
        top: number;
        left: number;
        width: number;
        height: number;
        bottom: number;
        right: number;
    };
    onUpdate: (value: string) => void;
    onClose: () => void;
}

export function InlineEditPopover({
    section,
    element,
    currentValue,
    rect,
    onUpdate,
    onClose,
}: InlineEditPopoverProps) {
    const [value, setValue] = useState(currentValue);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Determine popover position (above or below element)
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const showAbove = spaceBelow < 200 && spaceAbove > spaceBelow;

    const popoverStyle: React.CSSProperties = {
        position: "fixed",
        left: `${rect.left}px`,
        top: showAbove ? `${rect.top - 10}px` : `${rect.bottom + 10}px`,
        transform: showAbove ? "translateY(-100%)" : "none",
        zIndex: 9999,
    };

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Auto-save on value change with debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (value !== currentValue) {
                onUpdate(value);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [value, currentValue, onUpdate]);

    const isColorField = element.includes("Color") || element.includes("background") || element.includes("overlay");
    const isImageField = element.includes("image") || element.includes("Image");
    const isPaddingField = element.includes("Padding") || element.includes("padding");

    return (
        <div
            ref={popoverRef}
            style={popoverStyle}
            className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 min-w-[280px] max-w-[400px]"
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm capitalize">
                    Edit {element.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded transition"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3">
                {isColorField ? (
                    <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Color</Label>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="h-9 text-sm flex-1"
                                placeholder="#000000"
                            />
                            <input
                                type="color"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-12 h-9 rounded border cursor-pointer"
                            />
                        </div>
                    </div>
                ) : isImageField ? (
                    <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Image URL</Label>
                        <Input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="h-9 text-sm"
                            placeholder="https://..."
                        />
                        <Button variant="outline" size="sm" className="w-full">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                        </Button>
                    </div>
                ) : isPaddingField ? (
                    <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Padding</Label>
                        <Input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="h-9 text-sm"
                            placeholder="16px 32px"
                        />
                        <p className="text-xs text-gray-500">Format: top/bottom left/right</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Text</Label>
                        <Input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="h-9 text-sm"
                            autoFocus
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
