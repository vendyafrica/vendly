"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";

interface EditState {
    section: string | null;
    element: string | null;
    value: string;
    rect: DOMRect | null;
}

interface EditModeContextType {
    isEditMode: boolean;
    selectedSection: string | null;
    editState: EditState | null;
    updateProp: (value: string) => void;
    closeEditor: () => void;
}

const EditModeContext = createContext<EditModeContextType>({
    isEditMode: false,
    selectedSection: null,
    editState: null,
    updateProp: () => { },
    closeEditor: () => { },
});

export const useEditMode = () => useContext(EditModeContext);

interface EditModeProviderProps {
    children: ReactNode;
}

// Inline Edit Popover Component
function InlineEditPopover({
    editState,
    onUpdate,
    onClose,
}: {
    editState: EditState;
    onUpdate: (value: string) => void;
    onClose: () => void;
}) {
    const [value, setValue] = useState(editState.value);
    const inputRef = useRef<HTMLInputElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setValue(editState.value);
        inputRef.current?.focus();
        inputRef.current?.select();
    }, [editState]);

    // Auto-save on blur or enter
    const handleSave = () => {
        if (value !== editState.value) {
            onUpdate(value);
        }
        onClose();
    };

    // Handle keyboard
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            onClose();
        }
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                handleSave();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value]);

    if (!editState.rect) return null;

    const isColor = editState.element?.toLowerCase().includes("color") ||
        editState.element?.toLowerCase().includes("background");
    const isImage = editState.element?.toLowerCase().includes("image") ||
        editState.element?.toLowerCase().includes("url");

    // Position below the element
    const style: React.CSSProperties = {
        position: "fixed",
        top: editState.rect.bottom + 8,
        left: editState.rect.left,
        zIndex: 10000,
        minWidth: 240,
        maxWidth: 320,
    };

    return (
        <div
            ref={popoverRef}
            style={style}
            className="bg-white rounded-lg shadow-2xl border p-3 animate-in fade-in slide-in-from-top-2"
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500 capitalize">
                    {editState.element?.replace(/([A-Z])/g, " $1").trim()}
                </span>
            </div>

            <div className="flex items-center gap-2">
                {isColor ? (
                    <>
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-10 h-8 rounded border cursor-pointer"
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </>
                ) : (
                    <input
                        ref={inputRef}
                        type={isImage ? "url" : "text"}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isImage ? "Enter image URL..." : "Enter text..."}
                        className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
            </div>

            <div className="flex justify-end gap-2 mt-2">
                <button
                    onClick={onClose}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export function EditModeProvider({ children }: EditModeProviderProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [editState, setEditState] = useState<EditState | null>(null);

    // Detect edit mode
    useEffect(() => {
        const isInIframe = window.self !== window.top;
        const urlParams = new URLSearchParams(window.location.search);
        const editModeParam = urlParams.get("editMode");

        if (isInIframe || editModeParam === "true") {
            setIsEditMode(true);

            // Add edit mode class to body
            document.body.classList.add("edit-mode");

            // Listen for messages from parent
            const handleMessage = (event: MessageEvent) => {
                if (event.data.type === "ENABLE_EDIT_MODE") {
                    setIsEditMode(true);
                }
            };
            window.addEventListener("message", handleMessage);

            return () => {
                window.removeEventListener("message", handleMessage);
                document.body.classList.remove("edit-mode");
            };
        }
    }, []);

    // Handle clicks on editable elements
    useEffect(() => {
        if (!isEditMode) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Find closest editable element
            const editable = target.closest("[data-editable]");
            if (editable) {
                e.preventDefault();
                e.stopPropagation();

                const elementName = editable.getAttribute("data-editable");
                const section = editable.closest("[data-editable-section]")?.getAttribute("data-editable-section");

                // Get current value
                let currentValue = "";
                if (elementName?.includes("Color") || elementName?.includes("background")) {
                    currentValue = (editable as HTMLElement).style.backgroundColor ||
                        getComputedStyle(editable).backgroundColor;
                    // Convert rgb to hex
                    if (currentValue.startsWith("rgb")) {
                        const match = currentValue.match(/\d+/g);
                        if (match) {
                            currentValue = "#" + match.slice(0, 3).map(x =>
                                parseInt(x).toString(16).padStart(2, "0")
                            ).join("");
                        }
                    }
                } else if (elementName?.includes("image") || elementName?.includes("Url")) {
                    const style = (editable as HTMLElement).style.backgroundImage;
                    const match = style.match(/url\(["']?([^"')]+)["']?\)/);
                    currentValue = match ? match[1] : "";
                } else {
                    currentValue = editable.textContent || "";
                }

                setEditState({
                    section: section ?? null,
                    element: elementName ?? null,
                    value: currentValue,
                    rect: editable.getBoundingClientRect(),
                });

                return;
            }

            // Find closest section
            const section = target.closest("[data-editable-section]");
            if (section) {
                const sectionName = section.getAttribute("data-editable-section");
                setSelectedSection(sectionName);

                // Add selected class
                document.querySelectorAll("[data-editable-section].selected").forEach(el =>
                    el.classList.remove("selected")
                );
                section.classList.add("selected");
            }
        };

        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, [isEditMode]);

    // Update prop and notify parent
    const updateProp = (value: string) => {
        if (!editState?.element || !editState?.section) return;

        // Find the element and update it visually
        const section = document.querySelector(`[data-editable-section="${editState.section}"]`);
        const element = section?.querySelector(`[data-editable="${editState.element}"]`);

        if (element) {
            if (editState.element.includes("Color") || editState.element.includes("background")) {
                (element as HTMLElement).style.backgroundColor = value;
            } else if (editState.element.includes("image") || editState.element.includes("Url")) {
                (element as HTMLElement).style.backgroundImage = `url(${value})`;
            } else {
                element.textContent = value;
            }
        }

        // Notify parent window
        window.parent.postMessage({
            type: "PROP_UPDATED",
            section: editState.section,
            prop: editState.element,
            value,
        }, "*");
    };

    const closeEditor = () => {
        setEditState(null);
    };

    return (
        <EditModeContext.Provider value={{ isEditMode, selectedSection, editState, updateProp, closeEditor }}>
            {children}
            {isEditMode && editState && (
                <InlineEditPopover
                    editState={editState}
                    onUpdate={updateProp}
                    onClose={closeEditor}
                />
            )}
        </EditModeContext.Provider>
    );
}
