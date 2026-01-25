"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@vendly/ui/lib/utils";

export type Category = {
    id: string;
    label: string;
    icon?: React.ReactNode;
};

type CategorySelectorProps = {
    categories: Category[];
    selectedCategories?: Category[];
    onChange?: (selected: Category[]) => void;
    maxSelections?: number;
    className?: string;
};

export function CategorySelector({
    categories,
    selectedCategories: controlledSelected,
    onChange,
    maxSelections = 5,
    className
}: CategorySelectorProps) {
    // Support both controlled and uncontrolled modes
    const [internalSelected, setInternalSelected] = useState<Category[]>([]);
    const selectedCategories = controlledSelected ?? internalSelected;

    const selectedContainerRef = useRef<HTMLDivElement>(null);

    const isSelected = useCallback((id: string) =>
        selectedCategories.some((cat) => cat.id === id),
        [selectedCategories]
    );

    const toggleCategory = (category: Category) => {
        let newSelected: Category[];

        if (isSelected(category.id)) {
            newSelected = selectedCategories.filter((cat) => cat.id !== category.id);
        } else {
            if (selectedCategories.length >= maxSelections) return;
            newSelected = [...selectedCategories, category];
        }

        if (onChange) {
            onChange(newSelected);
        } else {
            setInternalSelected(newSelected);
        }
    };

    const removeCategory = (id: string) => {
        const newSelected = selectedCategories.filter((cat) => cat.id !== id);
        if (onChange) {
            onChange(newSelected);
        } else {
            setInternalSelected(newSelected);
        }
    };

    // Auto-scroll to show newest selection
    useEffect(() => {
        if (selectedContainerRef.current) {
            selectedContainerRef.current.scrollTo({
                left: selectedContainerRef.current.scrollWidth,
                behavior: "smooth",
            });
        }
    }, [selectedCategories]);

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {/* Selected Categories Display */}
            <AnimatePresence mode="popLayout">
                {selectedCategories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Selected ({selectedCategories.length}/{maxSelections})
                            </span>
                        </div>

                        <div
                            ref={selectedContainerRef}
                            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                        >
                            <AnimatePresence mode="popLayout">
                                {selectedCategories.map((category) => (
                                    <motion.div
                                        key={category.id}
                                        layoutId={`category-${category.id}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="group/tag flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-primary/5 border border-primary/20 rounded-full shrink-0 hover:border-primary/40 transition-colors"
                                    >
                                        <motion.span
                                            layoutId={`category-label-${category.id}`}
                                            className="text-sm font-medium text-primary"
                                        >
                                            {category.label}
                                        </motion.span>
                                        <button
                                            onClick={() => removeCategory(category.id)}
                                            className="p-0.5 rounded-full hover:bg-primary/10 transition-colors"
                                            type="button"
                                            aria-label={`Remove ${category.label}`}
                                        >
                                            <HugeiconsIcon
                                                icon={Cancel01Icon}
                                                className="size-4 text-primary/60 group-hover/tag:text-primary transition-colors"
                                            />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Available Categories Grid */}
            <div className="flex flex-col gap-2">
                <motion.div
                    layout
                    className="flex flex-wrap gap-2"
                >
                    <AnimatePresence mode="popLayout">
                        {categories.map((category) => {
                            const selected = isSelected(category.id);
                            const disabled = !selected && selectedCategories.length >= maxSelections;

                            return (
                                <motion.button
                                    key={category.id}
                                    layoutId={selected ? undefined : `category-${category.id}`}
                                    onClick={() => toggleCategory(category)}
                                    disabled={disabled}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                        opacity: disabled ? 0.5 : 1,
                                        scale: 1
                                    }}
                                    whileHover={!disabled ? { scale: 1.02 } : undefined}
                                    whileTap={!disabled ? { scale: 0.98 } : undefined}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    type="button"
                                    className={cn(
                                        "flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-all",
                                        "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                        selected
                                            ? "bg-primary text-primary-foreground border-transparent"
                                            : "bg-background border-border hover:border-primary/30 hover:bg-muted/50",
                                        disabled && "cursor-not-allowed"
                                    )}
                                    aria-pressed={selected}
                                    aria-label={`${selected ? 'Deselect' : 'Select'} ${category.label}`}
                                >
                                    {selected && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                        >
                                            <HugeiconsIcon
                                                icon={Tick01Icon}
                                                className="size-3.5"
                                            />
                                        </motion.span>
                                    )}
                                    <motion.span
                                        layoutId={selected ? undefined : `category-label-${category.id}`}
                                    >
                                        {category.label}
                                    </motion.span>
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
export { CategorySelector as TagsSelector };
