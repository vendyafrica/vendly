"use client";

import { Puck, usePuck } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "@vendly/ui/components/storefront/config";
import { Button } from "@vendly/ui/components/button";
import { Monitor, Smartphone, Tablet, ChevronLeft, ChevronRight, ChevronDown, Layers, Type, Square, LayoutTemplate, Settings, Palette } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { templates } from "./templates";
import { cn } from "@vendly/ui/lib/utils";

import { StoreLayout } from "@vendly/ui/components/storefront/primitives/StoreLayout";

import { Footer } from "@vendly/ui/components/storefront/primitives/Footer";

export default function EditorPage() {
    const params = useParams();
    const tenant = params?.tenant as string;
    const storeName = tenant.charAt(0).toUpperCase() + tenant.slice(1);
    const [activePage, setActivePage] = useState<"home" | "product">("home");
    const [data, setData] = useState(templates.home);

    // Update local data state when page changes
    useEffect(() => {
        setData(templates[activePage]);
    }, [activePage]);

    // Generate a modified config with root injection for iframe styles
    const modifiedConfig = {
        ...config,
        root: {
            render: ({ children }: { children: React.ReactNode }) => (
                <>
                    <StyleInjector />
                    <StoreLayout storeSlug={tenant} storeName={storeName}>
                        {children}
                        <Footer storeSlug={tenant} storeName={storeName} />
                    </StoreLayout>
                </>
            ),
        }
    };

    return (
        <Puck
            config={modifiedConfig}
            data={data}
            onPublish={(publishedData) => {
                console.log(`Published ${activePage}:`, publishedData);
            }}
            iframe={{
                enabled: true,
            }}
        >
            <EditorLayout
                tenant={tenant}
                activePage={activePage}
                setActivePage={setActivePage}
            />
        </Puck>
    );
}

function StyleInjector() {
    useEffect(() => {
        // Only run if in iframe
        if (window.self === window.top) return;

        const parentDocument = window.parent.document;
        const currentHead = document.head;

        // Copy <link rel="stylesheet">
        parentDocument.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
            // Check if already exists
            if (!currentHead.querySelector(`link[href="${link.getAttribute('href')}"]`)) {
                currentHead.appendChild(link.cloneNode(true));
            }
        });

        // Copy <style>
        parentDocument.querySelectorAll('style').forEach((style) => {
            // Basic deduplication check - naive but prevents massive duplication on re-renders
            if (!currentHead.innerHTML.includes(style.innerHTML)) {
                currentHead.appendChild(style.cloneNode(true));
            }
        });
    }, []);

    return null;
}

function EditorLayout({
    tenant,
    activePage,
    setActivePage
}: {
    tenant: string;
    activePage: "home" | "product";
    setActivePage: (page: "home" | "product") => void;
}) {
    const { appState, dispatch } = usePuck();
    const { selectedItem } = appState.ui;
    const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [propertyTab, setPropertyTab] = useState<"content" | "design">("content");

    // Load data into Puck when activePage changes (handled by parent passing new data to Puck, 
    // but we might need to reset selection)
    useEffect(() => {
        dispatch({ type: "setUi", ui: { itemSelector: null } });
    }, [activePage, dispatch]);

    const getViewportStyle = () => {
        switch (viewport) {
            case 'mobile': return { width: '375px', height: '100%' };
            case 'tablet': return { width: '768px', height: '100%' };
            default: return { width: '100%', height: '100%' };
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 z-20 relative">
                <div className="flex items-center w-1/3 gap-4">
                    <select
                        value={activePage}
                        onChange={(e) => setActivePage(e.target.value as "home" | "product")}
                        className="text-sm font-medium border-none bg-transparent focus:ring-0 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                    >
                        <option value="home">Home Page</option>
                        <option value="product">Product Page</option>
                    </select>
                </div>

                <div className="flex justify-center w-1/3">
                    <div className="hidden md:flex items-center rounded-lg border bg-gray-50/50 p-1">
                        <Button
                            variant={viewport === 'desktop' ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7 rounded-md"
                            onClick={() => setViewport('desktop')}
                        >
                            <Monitor className="h-4 w-4 text-gray-700" />
                        </Button>
                        <Button
                            variant={viewport === 'tablet' ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7 rounded-md"
                            onClick={() => setViewport('tablet')}
                        >
                            <Tablet className="h-4 w-4 text-gray-700" />
                        </Button>
                        <Button
                            variant={viewport === 'mobile' ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7 rounded-md"
                            onClick={() => setViewport('mobile')}
                        >
                            <Smartphone className="h-4 w-4 text-gray-700" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-end w-1/3 gap-2">
                    <Button size="sm" variant="ghost" onClick={() => console.log('Save')}>
                        Save Draft
                    </Button>
                    <Button size="sm" onClick={() => console.log('Publish')}>
                        Publish
                    </Button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left Sidebar: Layers & Properties */}
                <aside className="w-80 flex flex-col border-r bg-white h-full z-10 animate-in slide-in-from-left duration-200">
                    {selectedItem ? (
                        // Properties View
                        <div className="flex flex-col h-full bg-white">
                            <div className="flex items-center p-3 border-b bg-white gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-slate-100 text-gray-500"
                                    onClick={() => dispatch({ type: "setUi", ui: { itemSelector: null } })}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="font-semibold text-sm text-gray-800">{selectedItem.type}</span>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b">
                                <button
                                    onClick={() => setPropertyTab("content")}
                                    className={cn(
                                        "flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                                        propertyTab === "content" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    <Settings className="w-3.5 h-3.5" />
                                    Content
                                </button>
                                <button
                                    onClick={() => setPropertyTab("design")}
                                    className={cn(
                                        "flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                                        propertyTab === "design" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    <Palette className="w-3.5 h-3.5" />
                                    Design
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                {/* 
                                    Currently rendering all fields. 
                                    Future improvement: Filter fields based on tab active state using field metadata or naming convention.
                                */}
                                <Puck.Fields />
                            </div>
                        </div>
                    ) : (
                        // Layers / Components Tree View
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b flex items-center justify-between bg-white">
                                <h2 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Layers</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                                {appState.data.content.map((item, index) => (
                                    <LayerItem key={item.props.id} item={item} index={index} />
                                ))}

                                {appState.data.content.length === 0 && (
                                    <div className="p-8 text-center text-gray-400 text-sm">
                                        Page is empty.
                                    </div>
                                )}
                            </div>
                            {/* Removed Component List to disable Drag & Drop for new components */}
                        </div>
                    )}
                </aside>

                {/* Center Canvas */}
                <main className="flex-1 overflow-hidden bg-gray-100/50 relative flex flex-col items-center justify-center p-8">
                    <div
                        className="shadow-xl bg-white rounded-lg border overflow-hidden relative isolate transition-all duration-300 ease-in-out"
                        style={getViewportStyle()}
                    >
                        <Puck.Preview />
                    </div>
                </main>

            </div>
        </div>
    );
}

function LayerItem({ item, index, zone, depth = 0 }: { item: any, index: number, zone?: string, depth?: number }) {
    const { appState, dispatch } = usePuck();
    const { selectedItem } = appState.ui;
    const isSelected = selectedItem?.props.id === item.props.id;

    const zoneKey = `${item.props.id}:content`;
    // @ts-expect-error - zones might be untyped in this context depending on Puck version
    const children = appState.data.zones?.[zoneKey] || [];
    const hasChildren = children.length > 0;

    const [isExpanded, setIsExpanded] = useState(true);

    const getIconForType = (type: string) => {
        switch (type) {
            case 'HeadingBlock': return <Type className="h-3.5 w-3.5" />;
            case 'Hero': return <LayoutTemplate className="h-3.5 w-3.5" />;
            case 'Section': return <Square className="h-3.5 w-3.5" />;
            default: return <Layers className="h-3.5 w-3.5" />;
        }
    };

    return (
        <div>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "setUi", ui: { itemSelector: { index, zone } } });
                }}
                className={`
               flex items-center gap-2 p-1.5 rounded-md cursor-pointer text-sm mb-0.5 transition-colors border border-transparent
               ${isSelected ? "bg-blue-50 text-blue-600 border-blue-100 font-medium" : "hover:bg-gray-100 text-gray-700"}
            `}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
                <div
                    className="w-4 h-4 flex items-center justify-center rounded hover:bg-black/5 cursor-pointer"
                    onClick={(e) => {
                        if (hasChildren) {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }
                    }}
                >
                    {hasChildren ? (
                        isExpanded ? <ChevronDown className="h-3 w-3 text-gray-400" /> : <ChevronRight className="h-3 w-3 text-gray-400" />
                    ) : <div className="w-3" />}
                </div>

                <span className={`text-opacity-70 ${isSelected ? "text-blue-500" : "text-gray-400"}`}>
                    {getIconForType(item.type)}
                </span>
                <span className="truncate">{item.type}</span>
            </div>

            {isExpanded && hasChildren && (
                <div>
                    {children.map((child: any, childIndex: number) => (
                        <LayerItem
                            key={child.props.id}
                            item={child}
                            index={childIndex}
                            zone={zoneKey}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
