"use client";

import { useEffect, useState, useRef } from "react";
import type { Editor } from "grapesjs";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css"; // Import GrapesJS CSS
import { Button } from "@vendly/ui/components/button";
import { cn } from "@vendly/ui/lib/utils";
import {
    Monitor,
    Tablet,
    Smartphone,
    Undo,
    Redo,
    Eye,
    Save,
    MousePointer2,
    Image as ImageIcon,
} from "lucide-react";
import { Label } from "@vendly/ui/components/label";
import { Input } from "@vendly/ui/components/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@vendly/ui/components/select";
import { Slider } from "@vendly/ui/components/slider";

// GrapesJS Imports
import GrapesjsReact, { Canvas, useEditor, useEditorMaybe } from "@grapesjs/react";
const EditorProvider = GrapesjsReact;

// Initialize GrapesJS options
const gjsOptions = {
    height: "100%",
    width: "100%",
    showOffsets: true,
    noticeOnUnload: false,
    storageManager: false,
    deviceManager: {
        devices: [
            { id: "desktop", name: "Desktop", width: "" },
            { id: "tablet", name: "Tablet", width: "768px" },
            { id: "mobilePortrait", name: "Mobile", width: "320px" },
        ],
    },
    panels: { defaults: [] },
    canvas: {
        styles: [
            "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
        ],
        scripts: [
            "https://cdn.tailwindcss.com",
        ],
    },
};

interface GrapesJSEditorProps {
    initialHtml?: string;
    initialCss?: string;
    onSave: (html: string, css: string) => Promise<void>;
    uploadUrl?: string;
}

// Top Toolbar Component
const EditorTopbar = ({
    onSave,
    uploadUrl,
    className,
}: {
    onSave: () => void;
    uploadUrl?: string;
    className?: string;
}) => {
    const editor = useEditorMaybe();
    const [device, setDevice] = useState("desktop");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDeviceChange = (dev: string) => {
        setDevice(dev);
        (editor as any)?.setDevice(dev);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor || !uploadUrl) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(uploadUrl, { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                if (data.url) {
                    (editor as any).addComponents(`<img src="${data.url}" alt="Image" style="max-width:100%;" />`);
                }
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error uploading image");
        }

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className={cn("flex items-center justify-between p-2 border-b bg-white", className)}>
            <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", device === "desktop" && "bg-white shadow-sm")}
                        onClick={() => handleDeviceChange("desktop")}
                    >
                        <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", device === "tablet" && "bg-white shadow-sm")}
                        onClick={() => handleDeviceChange("tablet")}
                    >
                        <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", device === "mobilePortrait" && "bg-white shadow-sm")}
                        onClick={() => handleDeviceChange("mobilePortrait")}
                    >
                        <Smartphone className="h-4 w-4" />
                    </Button>
                </div>

                <div className="h-6 w-px bg-gray-200 mx-2" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => (editor as any)?.UndoManager.undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => (editor as any)?.UndoManager.redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", (editor as any)?.getModel().get("preview") && "bg-blue-100 text-blue-600")}
                    onClick={() => {
                        if (editor) {
                            const isPreview = (editor as any).getModel().get("preview");
                            if (isPreview) (editor as any).stopCommand("preview");
                            else (editor as any).runCommand("preview");
                        }
                    }}
                >
                    <Eye className="h-4 w-4" />
                </Button>

                {uploadUrl && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => fileInputRef.current?.click()}
                            title="Insert Image"
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button size="sm" onClick={onSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

// Sidebar Component
const EditorSidebar = () => {
    const editor = useEditorMaybe();
    const [selectedComponent, setSelectedComponent] = useState<any>(null);

    useEffect(() => {
        if (!editor) return;

        const onSelected = () => {
            const selected = editor.getSelected();
            setSelectedComponent(selected);
        };
        const onDeselected = () => setSelectedComponent(null);

        editor.on("component:selected", onSelected);
        editor.on("component:deselected", onDeselected);

        // Initial check
        const selected = editor.getSelected();
        if (selected) setSelectedComponent(selected);

        return () => {
            editor.off("component:selected", onSelected);
            editor.off("component:deselected", onDeselected);
        };
    }, [editor]);

    const updateStyle = (prop: string, value: string) => {
        if (!selectedComponent) return;
        selectedComponent.addStyle({ [prop]: value });
        editor?.trigger("component:styleUpdate");
    };

    const getStyle = (prop: string) => {
        if (!selectedComponent) return "";
        const style = selectedComponent.getStyle();
        return style[prop] || "";
    };

    if (!selectedComponent) {
        return (
            <div className="w-80 border-l bg-white flex flex-col h-full items-center justify-center p-6 text-center text-muted-foreground">
                <MousePointer2 className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm">Select an element on the canvas to edit its styles.</p>
            </div>
        );
    }

    return (
        <div className="w-80 border-l bg-white flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-sm">Valid Editing</h3>
                <span className="text-[10px] uppercase font-mono bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                    {selectedComponent.get("tagName")}
                </span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-6">
                {/* Typography */}
                <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Typography</h4>
                    <div className="space-y-2">
                        <Label className="text-xs">Font Family</Label>
                        <Select
                            onValueChange={(val) => updateStyle("font-family", val)}
                            defaultValue={getStyle("font-family")}
                        >
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                                <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                                <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                                <SelectItem value="system-ui, sans-serif">System UI</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label className="text-xs">Font Size</Label>
                            <div className="flex items-center gap-1 border rounded px-2 h-8">
                                <input
                                    className="w-full text-xs outline-none bg-transparent"
                                    defaultValue={getStyle("font-size").replace("px", "")}
                                    placeholder="16"
                                    onChange={(e) => updateStyle("font-size", e.target.value ? e.target.value + "px" : "")}
                                />
                                <span className="text-[10px] text-gray-400">px</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Weight</Label>
                            <Select
                                onValueChange={(val) => updateStyle("font-weight", val)}
                                defaultValue={getStyle("font-weight")}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="300">Light</SelectItem>
                                    <SelectItem value="400">Regular</SelectItem>
                                    <SelectItem value="600">Semi-Bold</SelectItem>
                                    <SelectItem value="700">Bold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Text Color</Label>
                        <div className="flex gap-2">
                            <Input
                                className="h-8 flex-1 font-mono text-xs"
                                defaultValue={getStyle("color")}
                                onChange={(e) => updateStyle("color", e.target.value)}
                                placeholder="#000000"
                            />
                            <input
                                type="color"
                                className="h-8 w-8 p-0 border-0 rounded cursor-pointer"
                                onChange={(e) => updateStyle("color", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {/* Appearance */}
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Appearance</h4>
                    <div className="space-y-2">
                        <Label className="text-xs">Background</Label>
                        <div className="flex gap-2">
                            <Input
                                className="h-8 flex-1 font-mono text-xs"
                                defaultValue={getStyle("background-color")}
                                onChange={(e) => updateStyle("background-color", e.target.value)}
                                placeholder="transparent"
                            />
                            <input
                                type="color"
                                className="h-8 w-8 p-0 border-0 rounded cursor-pointer"
                                onChange={(e) => updateStyle("background-color", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Border Radius</Label>
                        <div className="flex items-center gap-3">
                            <Slider
                                defaultValue={[parseInt(getStyle("border-radius") || "0")]}
                                max={50}
                                step={1}
                                onValueChange={(vals) => updateStyle("border-radius", vals[0] + "px")}
                                className="flex-1"
                            />
                            <span className="text-xs text-gray-500 w-8 text-right">
                                {parseInt(getStyle("border-radius") || "0")}px
                            </span>
                        </div>
                    </div>
                </div>
                {/* Spacing */}
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Layout</h4>
                    <div className="space-y-2">
                        <Label className="text-xs">Padding</Label>
                        <div className="flex items-center gap-3">
                            <Slider
                                defaultValue={[parseInt(getStyle("padding") || "0")]}
                                max={100}
                                step={4}
                                onValueChange={(vals) => updateStyle("padding", vals[0] + "px")}
                                className="flex-1"
                            />
                            <span className="text-xs text-gray-500 w-8 text-right">
                                {parseInt(getStyle("padding") || "0")}px
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function GrapesJSEditor({
    initialHtml,
    initialCss,
    onSave,
    uploadUrl,
}: GrapesJSEditorProps) {
    const onEditorInit = (editor: Editor) => {
        console.log("Editor loaded", editor);
        if (initialHtml) {
            editor.setComponents(initialHtml);
        }
        if (initialCss) {
            editor.setStyle(initialCss);
        }
    };

    return (
        <div className="h-screen w-full overflow-hidden border">
            <EditorProvider
                grapesjs={grapesjs}
                onEditor={onEditorInit}
                options={gjsOptions}
                plugins={[]}
            >
                <InternalLayout onSave={onSave} uploadUrl={uploadUrl} />
            </EditorProvider>
        </div>
    );
}

// Internal layout to access Editor Context
const InternalLayout = ({
    onSave,
    uploadUrl
}: {
    onSave: (h: string, c: string) => Promise<void>;
    uploadUrl?: string;
}) => {
    const editor = useEditorMaybe();
    const handleSave = async () => {
        if (!editor) return;
        const html = editor.getHtml();
        const css = editor.getCss() || "";
        await onSave(html, css);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <EditorTopbar onSave={handleSave} uploadUrl={uploadUrl} />
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 bg-[#f0f0f0] relative overflow-hidden">
                    {/* The Canvas component needs to be wrapped in a div that handles the background/padding */}
                    <Canvas className="grapesjs-canvas h-full" />
                </div>
                <EditorSidebar />
            </div>
        </div>
    );
};
