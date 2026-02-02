"use client";

import { useMemo, useState } from "react";

export function StyleGuide({ type }: { type: "clothes" | "shoes" }) {
    const [activeTab, setActiveTab] = useState<"guide" | "fit">("guide");

    const content = useMemo(() => {
        if (type === "shoes") {
            return {
                title: "Shoe Size Guide",
                guide: [
                    { us: "6", eu: "39", uk: "5" },
                    { us: "7", eu: "40", uk: "6" },
                    { us: "8", eu: "41", uk: "7" },
                    { us: "9", eu: "42", uk: "8" },
                    { us: "10", eu: "43", uk: "9" },
                    { us: "11", eu: "44", uk: "10" },
                ],
                fit: [
                    "If you’re between sizes, size up.",
                    "Wide feet: consider half a size up.",
                ],
            };
        }

        return {
            title: "Clothing Size Guide",
            guide: [
                { size: "XS", bust: "31-32", waist: "24-25", hips: "34-35" },
                { size: "S", bust: "33-34", waist: "26-27", hips: "36-37" },
                { size: "M", bust: "35-36", waist: "28-29", hips: "38-39" },
                { size: "L", bust: "37-39", waist: "30-32", hips: "40-42" },
                { size: "XL", bust: "40-42", waist: "33-35", hips: "43-45" },
                { size: "1X", bust: "43-45", waist: "36-38", hips: "46-48" },
                { size: "2X", bust: "46-48", waist: "39-41", hips: "49-51" },
                { size: "3X", bust: "49-51", waist: "42-44", hips: "52-54" },
            ],
            fit: [
                "Fits true to size for a regular fit.",
                "For an oversized look, size up.",
            ],
        };
    }, [type]);

    return (
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-50">
                <div className="text-sm font-medium text-neutral-900">{content.title}</div>
                <div className="flex items-center gap-1">
                    <button
                        className={`h-8 px-3 rounded-md text-xs font-medium transition-colors ${activeTab === "guide" ? "bg-white border border-neutral-200 text-neutral-900" : "text-neutral-600 hover:text-neutral-900"}`}
                        onClick={() => setActiveTab("guide")}
                        type="button"
                    >
                        Guide
                    </button>
                    <button
                        className={`h-8 px-3 rounded-md text-xs font-medium transition-colors ${activeTab === "fit" ? "bg-white border border-neutral-200 text-neutral-900" : "text-neutral-600 hover:text-neutral-900"}`}
                        onClick={() => setActiveTab("fit")}
                        type="button"
                    >
                        Fit Notes
                    </button>
                </div>
            </div>

            <div className="p-4">
                {activeTab === "fit" ? (
                    <div className="space-y-2">
                        {content.fit.map((t) => (
                            <div key={t} className="text-sm text-neutral-600">
                                {t}
                            </div>
                        ))}
                    </div>
                ) : type === "shoes" ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-neutral-500">
                                    <th className="py-2 pr-4">US</th>
                                    <th className="py-2 pr-4">EU</th>
                                    <th className="py-2">UK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(content.guide as Array<{ us: string; eu: string; uk: string }>).map((row) => (
                                    <tr key={row.us} className="border-t border-neutral-100">
                                        <td className="py-2 pr-4 text-neutral-900 font-medium">{row.us}</td>
                                        <td className="py-2 pr-4 text-neutral-700">{row.eu}</td>
                                        <td className="py-2 text-neutral-700">{row.uk}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-neutral-500">
                                    <th className="py-2 pr-4">Size</th>
                                    <th className="py-2 pr-4">Bust</th>
                                    <th className="py-2 pr-4">Waist</th>
                                    <th className="py-2">Hips</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(content.guide as Array<{ size: string; bust: string; waist: string; hips: string }>).map((row) => (
                                    <tr key={row.size} className="border-t border-neutral-100">
                                        <td className="py-2 pr-4 text-neutral-900 font-medium">{row.size}</td>
                                        <td className="py-2 pr-4 text-neutral-700">{row.bust}</td>
                                        <td className="py-2 pr-4 text-neutral-700">{row.waist}</td>
                                        <td className="py-2 text-neutral-700">{row.hips}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3 text-xs text-neutral-500">Measurements are in inches.</div>
                    </div>
                )}
            </div>
        </div>
    );
}
