import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const themeClasses = {
  background: {
    default: "bg-[var(--color-background)] text-[var(--color-foreground)]",
    muted: "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
    card: "bg-[var(--color-card)] text-[var(--color-card-foreground)]",
    accent: "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]",
    primary: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
    secondary: "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]",
  },
  
  text: {
    default: "text-[var(--color-foreground)]",
    muted: "text-[var(--color-muted-foreground)]",
    primary: "text-[var(--color-primary)]",
    secondary: "text-[var(--color-secondary)]",
    accent: "text-[var(--color-accent-foreground)]",
  },
  
  border: {
    default: "border-[var(--color-border)]",
    muted: "border-[var(--color-muted)]",
    accent: "border-[var(--color-accent)]",
    primary: "border-[var(--color-primary)]",
  },
  
  button: {
    default: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90",
    secondary: "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:bg-[var(--color-accent)]",
    outline: "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]",
    ghost: "bg-transparent hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]",
    destructive: "bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:opacity-90",
  },
  
  hover: {
    accent: "hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]",
    primary: "hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]",
    muted: "hover:bg-[var(--color-muted)]",
  },
  
  focus: {
    ring: "focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2",
    border: "focus:border-[var(--color-primary)]",
  },
  
  card: "rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)]",
  input: "border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)] rounded-[var(--radius)]",
  shadow: {
    sm: "shadow-[var(--shadow-sm)]",
    base: "shadow-[var(--shadow-base)]",
    md: "shadow-[var(--shadow-md)]",
    lg: "shadow-[var(--shadow-lg)]",
  },
} as const;

export function getThemeClasses(
  type: keyof typeof themeClasses,
  variant: string = "default",
  additionalClasses?: string
): string {
  const baseClasses = themeClasses[type];
  if (typeof baseClasses === "string") {
    return cn(baseClasses, additionalClasses);
  }
  
  const variantClasses = (baseClasses as Record<string, string>)[variant] || 
                        (baseClasses as Record<string, string>).default || "";
  
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
