"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { StoreTheme, ThemeVariant } from "../types/store-config";
import { themes, getTheme, getThemeVariables } from "../themes";

interface ThemeContextType {
  theme: StoreTheme;
  variant: ThemeVariant;
  setTheme: (variant: ThemeVariant) => void;
  applyTheme: (theme: StoreTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface StoreThemeProviderProps {
  children: React.ReactNode;
  config?: StoreTheme;
  defaultVariant?: ThemeVariant;
  storeId?: string;
}

export function StoreThemeProvider({ 
  children, 
  config, 
  defaultVariant,
  storeId 
}: StoreThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<StoreTheme>(
    config || getTheme(defaultVariant)
  );
  const [currentVariant, setCurrentVariant] = useState<ThemeVariant>(
    config?.id as ThemeVariant || defaultVariant
  );

  const applyThemeVariables = (theme: StoreTheme) => {
    const variables = getThemeVariables(theme);
    
    // Apply CSS variables to the document root
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  };

  const setTheme = (variant: ThemeVariant) => {
    const newTheme = getTheme(variant);
    setCurrentTheme(newTheme);
    setCurrentVariant(variant);
    applyThemeVariables(newTheme);
    
    // Persist theme choice for this store
    if (storeId && typeof window !== "undefined") {
      localStorage.setItem(`vendly-theme-${storeId}`, variant);
    }
  };

  const applyTheme = (theme: StoreTheme) => {
    setCurrentTheme(theme);
    setCurrentVariant(theme.id as ThemeVariant);
    applyThemeVariables(theme);
  };

  // Load persisted theme on mount
  useEffect(() => {
    if (storeId && typeof window !== "undefined") {
      const persistedTheme = localStorage.getItem(`vendly-theme-${storeId}`) as ThemeVariant;
      if (persistedTheme && themes[persistedTheme]) {
        setTheme(persistedTheme);
        return;
      }
    }
    
    // Apply the initial theme
    applyThemeVariables(currentTheme);
  }, [storeId]);

  // Update theme when config prop changes
  useEffect(() => {
    if (config) {
      applyTheme(config);
    }
  }, [config]);

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    variant: currentVariant,
    setTheme,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div 
        className="theme-root"
        data-theme={currentVariant}
        data-store={storeId}
        style={{
          colorScheme: currentTheme.colors.background === "#ffffff" ? "light" : "dark",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a StoreThemeProvider");
  }
  return context;
}

// Theme-aware components
export interface ThemedProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "ghost";
  asChild?: boolean;
}

export function ThemedContainer({ 
  children, 
  variant = "default", 
  className = "",
  ...props 
}: ThemedProps) {
  const baseClasses = "transition-colors duration-200";
  const variantClasses = {
    default: "bg-[var(--color-background)] text-[var(--color-text)]",
    outline: "border border-[var(--color-text)] bg-[var(--color-background)] text-[var(--color-text)]",
    ghost: "bg-transparent text-[var(--color-text)]",
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function ThemedButton({
  children,
  variant = "default",
  className = "",
  ...props
}: ThemedProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseClasses = "px-4 py-2 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default: "bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover-bg)] hover:text-[var(--button-hover-text)] rounded-[var(--button-radius)]",
    outline: "border-2 border-[var(--button-bg)] bg-transparent text-[var(--button-bg)] hover:bg-[var(--button-bg)] hover:text-[var(--button-text)] rounded-[var(--button-radius)]",
    ghost: "bg-transparent text-[var(--button-bg)] hover:bg-[var(--button-bg)] hover:text-[var(--button-text)] rounded-[var(--button-radius)]",
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ThemedCard({
  children,
  className = "",
  ...props
}: ThemedProps) {
  const baseClasses = "rounded-[var(--button-radius)] border border-[var(--color-text)] bg-[var(--color-background)] text-[var(--color-text)] transition-shadow duration-200 shadow-sm hover:shadow-md";

  return (
    <div 
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
