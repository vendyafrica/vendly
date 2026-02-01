"use client";

import { useState, useEffect } from "react";
import { Button } from "@vendly/ui/components/button";
import {
    Field,
    FieldGroup,
} from "@vendly/ui/components/field";
import CategoriesSelector from "../components/categories";
import { useOnboarding } from "../context/onboarding-context";
import { getCategoriesAction } from "../lib/categories";
import { type Category } from "../components/tag-selector";

export default function BusinessInfo() {
    const { data, saveBusiness, completeOnboarding, goBack, isLoading, error } = useOnboarding();

    const [categories, setCategories] = useState<string[]>(data.business?.categories ?? []);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoriesAction();
            if (res.success && res.data) {
                const mapped = res.data.map((c) => ({
                    id: c.slug,
                    label: c.name,
                }));
                setAvailableCategories(mapped);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (categories.length === 0) {
            return;
        }

        const saved = await saveBusiness({ categories });

        if (saved) {
            await completeOnboarding({ business: { categories } });
        }
    };

    return (
        <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8">
            <form className="space-y-6 rounded-md p-8 shadow-md bg-background" onSubmit={handleSubmit}>
                {error && (
                    <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        {error}
                    </p>
                )}

                <FieldGroup>
                    <Field>
                        <CategoriesSelector
                            selectedCategories={categories}
                            onChange={setCategories}
                            availableCategories={availableCategories}
                        />
                    </Field>
                </FieldGroup>

                {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Please select at least one category
                    </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        disabled={isLoading}
                        className="bg-muted hover:bg-red-400 hover:text-white border-0"
                    >
                        Back
                    </Button>

                    <Button
                        type="submit"
                        disabled={isLoading || categories.length === 0}
                        className="bg-primary hover:bg-primary/90 hover:text-white"
                    >
                        {isLoading ? "Creating store..." : "Create Store"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
