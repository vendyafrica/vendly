export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export const themeClasses = {
  background: {
    default: "bg-[var(--color-background)] text-[var(--color-text)]",
    card: "bg-[var(--color-background)] text-[var(--color-text)]",
    muted: "bg-[color-mix(in srgb,var(--color-background) 92%,#000)] text-[color-mix(in srgb,var(--color-text) 70%,#000)]",
    primary: "bg-[var(--button-bg)] text-[var(--button-text)]",
  },

  text: {
    default: "text-[var(--color-text)]",
    muted: "text-[color-mix(in srgb,var(--color-text) 75%,#000)]",
    primary: "text-[var(--color-text)]",
  },

  border: {
    default: "border-[color-mix(in srgb,var(--color-text) 35%,#000)]",
    primary: "border-[var(--button-bg)]",
  },

  button: {
    default: "bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover-bg)] hover:text-[var(--button-hover-text)] rounded-[var(--button-radius)] transition-colors duration-200",
    outline: "border border-[var(--button-bg)] bg-transparent text-[var(--button-bg)] hover:bg-[var(--button-bg)] hover:text-[var(--button-text)] rounded-[var(--button-radius)] transition-colors duration-200",
    ghost: "bg-transparent text-[var(--button-bg)] hover:bg-[var(--button-bg)] hover:text-[var(--button-text)] rounded-[var(--button-radius)] transition-colors duration-200",
  },

  hover: {
    accent: "hover:bg-[var(--button-bg)] hover:text-[var(--button-text)]",
    primary: "hover:bg-[var(--button-bg)] hover:text-[var(--button-text)]",
    muted: "hover:bg-[color-mix(in srgb,var(--color-background) 88%,#000)]",
  },

  focus: {
    ring: "focus:outline-none focus:ring-2 focus:ring-[var(--button-bg)] focus:ring-offset-2",
    border: "focus:border-[var(--button-bg)]",
  },

  card: "rounded-[var(--button-radius)] border border-[color-mix(in srgb,var(--color-text) 35%,#000)] bg-[var(--color-background)] text-[var(--color-text)]",
  input: "border border-[color-mix(in srgb,var(--color-text) 35%,#000)] bg-[var(--color-background)] text-[var(--color-text)] rounded-[var(--button-radius)]",
  shadow: {
    sm: "shadow-sm",
    base: "shadow",
    md: "shadow-md",
    lg: "shadow-lg",
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

// Animation classes
export const animations = {
  transition: "transition-all duration-200 ease-in-out",
  hover: "transition-transform duration-300 hover:scale-105",
  fade: "transition-opacity duration-300",
  slide: "transition-transform duration-300 ease-in-out",
} as const;
