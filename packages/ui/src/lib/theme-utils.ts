import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const themeClasses = {
  background: {
    default: "bg-[var(--color-background)] text-[var(--color-text)]",
  },

  text: {
    default: "text-[var(--color-text)]",
  },

  font: {
    default: "font-[var(--font-family)]",
  },

  button: {
    default:
      "bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover-bg)] hover:text-[var(--button-hover-text)] rounded-[var(--button-radius)] transition-colors duration-200",
    outline:
      "border-2 border-[var(--button-bg)] bg-transparent text-[var(--button-bg)] hover:bg-[var(--button-bg)] hover:text-[var(--button-text)] rounded-[var(--button-radius)] transition-colors duration-200",
    ghost:
      "bg-transparent text-[var(--button-bg)] hover:bg-[var(--button-bg)] hover:text-[var(--button-text)] rounded-[var(--button-radius)] transition-colors duration-200",
  },
} as const;

export function getThemeClasses(
  type: keyof typeof themeClasses,
  variant: string = "default",
  additionalClasses?: string,
): string {
  const baseClasses = themeClasses[type];
  if (typeof baseClasses === "string") {
    return cn(baseClasses, additionalClasses);
  }

  const variantClasses =
    (baseClasses as Record<string, string>)[variant] ||
    (baseClasses as Record<string, string>).default ||
    "";

  return cn(variantClasses, additionalClasses);
}

export const responsive = {
  container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  grid: {
    responsive: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    categories: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    featured: "grid grid-cols-1 md:grid-cols-2",
  },
  spacing: {
    section: "py-12 lg:py-16",
    container: "px-6 md:px-16 lg:px-24",
  },
} as const;

export const animations = {
  transition: "transition-all duration-200 ease-in-out",
  hover: "transition-transform duration-300 hover:scale-105",
  fade: "transition-opacity duration-300",
  slide: "transition-transform duration-300 ease-in-out",
} as const;
