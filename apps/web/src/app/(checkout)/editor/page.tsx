"use client";

import { PlateEditor } from "@vendly/ui/components/plate-editor";

export default function EditorTestPage() {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-2xl font-serif font-bold mb-6">Plate Editor Test</h1>
            <p className="text-neutral-500 mb-8">
                This area tests the Plate.js integration. Currently, it's a basic read-only or empty state configuration.
                We will expand this to support rich text editing for Storefront content.
            </p>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
                <PlateEditor />
            </div>
        </div>
    );
}
