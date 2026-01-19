"use client";

import React from "react";
import { useTheme } from "./theme-provider";
import { type ThemeVariant } from "@vendly/ui/types/store-config";
import { cn, themeClasses } from "../lib/theme-utils";

interface ThemeSwitcherProps {
  className?: string;
  showLabels?: boolean;
}

export function ThemeSwitcher({ className, showLabels = true }: ThemeSwitcherProps) {
  const { variant, setTheme } = useTheme();

  const themes: Array<{ key: ThemeVariant; name: string; description: string; colors: string[] }> = [
    {
      key: "default",
      name: "Default",
      description: "Clean and neutral",
      colors: ["#71717a", "#52525b", "#3f3f46", "#27272a"]
    },
    {
      key: "glacier", 
      name: "Glacier",
      description: "Cool blues and whites",
      colors: ["#0ea5e9", "#0284c7", "#0369a1", "#075985"]
    },
    {
      key: "harvest",
      name: "Harvest", 
      description: "Warm oranges and browns",
      colors: ["#ea580c", "#dc2626", "#c2410c", "#9a3412"]
    },
    {
      key: "lavender",
      name: "Lavender",
      description: "Soft purples", 
      colors: ["#a855f7", "#9333ea", "#7c3aed", "#6b21a8"]
    },
    {
      key: "brutalist",
      name: "Brutalist",
      description: "Bold black and white contrast",
      colors: ["#000000", "#18181b", "#27272a", "#3f3f46"]
    },
    {
      key: "obsidian",
      name: "Obsidian", 
      description: "Dark and mysterious",
      colors: ["#64748b", "#475569", "#334155", "#1e293b"]
    },
    {
      key: "orchid",
      name: "Orchid",
      description: "Vibrant pinks and magentas",
      colors: ["#ec4899", "#db2777", "#be185d", "#9d174d"]
    },
    {
      key: "solar",
      name: "Solar",
      description: "Bright yellows and golds", 
      colors: ["#eab308", "#ca8a04", "#a16207", "#854d0e"]
    }
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showLabels && (
        <div>
          <h3 className={cn("text-lg font-semibold mb-2", themeClasses.text.default)}>
            Theme Switcher
          </h3>
          <p className={cn("text-sm", themeClasses.text.muted)}>
            Switch between different theme variants to see the storefront adapt
          </p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-3">
        {themes.map((theme) => (
          <button
            key={theme.key}
            onClick={() => setTheme(theme.key)}
            className={cn(
              "flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200",
              "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
              variant === theme.key
                ? cn(themeClasses.border.primary, themeClasses.background.accent)
                : cn(themeClasses.border.default, themeClasses.background.card, "hover:border-primary")
            )}
          >
            {/* Theme Preview Color Dots */}
            <div className="flex items-center justify-center gap-1 w-12 h-12 mb-2">
              {theme.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Theme Info */}
            <div className="text-center">
              <div className={cn(
                "font-medium text-sm",
                variant === theme.key ? themeClasses.text.primary : themeClasses.text.default
              )}>
                {theme.name}
              </div>
              {showLabels && (
                <div className={cn("text-xs mt-1", themeClasses.text.muted)}>
                  {theme.description}
                </div>
              )}
            </div>
            
            {/* Active Indicator */}
            {variant === theme.key && (
              <div className="mt-2 flex items-center gap-1">
                <div className={cn("w-2 h-2 rounded-full", themeClasses.background.primary)} />
                <span className={cn("text-xs font-medium", themeClasses.text.primary)}>
                  Active
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Current Theme Info */}
      <div className={cn(
        "mt-4 p-3 rounded-lg border",
        themeClasses.background.muted,
        themeClasses.border.default
      )}>
        <div className="flex items-center justify-between">
          <div>
            <span className={cn("text-sm font-medium", themeClasses.text.default)}>
              Current Theme:
            </span>
            <span className={cn("ml-2 text-sm", themeClasses.text.primary)}>
              {themes.find(t => t.key === variant)?.name || "Unknown"}
            </span>
          </div>
          <div className={cn("text-xs", themeClasses.text.muted)}>
            Theme persisted per store
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating Theme Switcher for demo purposes
export function FloatingThemeSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg border-2 transition-all duration-200",
          "flex items-center justify-center",
          themeClasses.background.primary,
          themeClasses.border.primary,
          "hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-30"
        )}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a4 4 0 014-4h10a4 4 0 014 4v12a4 4 0 01-4 4H7zM7 21h10M7 21v-4a4 4 0 014-4h2M7 5a2 2 0 012-2h6a2 2 0 012 2M7 5v6a2 2 0 002 2h6a2 2 0 002-2V5"
          />
        </svg>
      </button>

      {/* Theme Switcher Panel */}
      {isOpen && (
        <div className={cn(
          "absolute bottom-16 right-0 w-80 p-4 rounded-lg shadow-xl border",
          themeClasses.background.card,
          themeClasses.border.default,
          "transform transition-all duration-200 origin-bottom-right"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h4 className={cn("font-semibold", themeClasses.text.default)}>
              Theme Switcher
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                themeClasses.hover.accent
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <ThemeSwitcher showLabels={false} />
        </div>
      )}
    </div>
  );
}
