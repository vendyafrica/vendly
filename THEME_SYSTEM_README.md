# Vendly Storefront Theme Configuration System

A comprehensive theme configuration system inspired by tweakcn concepts that allows for configurable, minimalistic storefront designs with per-store theme persistence.

## Overview

This implementation provides a complete theme management system that includes:
- **3 Minimalistic Theme Variants**: Clean, professional color schemes
- **Per-Store Theme Persistence**: Themes are saved per store in localStorage
- **CSS Variable-Based Theming**: Dynamic theme switching without page reloads
- **Component-Level Theme Integration**: All storefront components use theme-aware classes
- **Theme Switching UI**: Interactive components for testing and switching themes

## Architecture

### Core Components

#### 1. Theme Provider (`src/components/theme-provider.tsx`)
- React Context for theme state management
- CSS variable injection for dynamic theming
- Per-store theme persistence using localStorage
- Support for 3 theme variants: `minimal`, `warm`, `cool`

#### 2. Theme Utilities (`src/lib/theme-utils.ts`)
- Utility functions for CSS class management
- Theme-aware class generators
- Animation and responsive design utilities
- Consistent styling patterns across components

#### 3. Theme Definitions
**Minimal Theme**: Clean black & white with subtle grays
```typescript
colors: {
  primary: "#000000",
  background: "#ffffff", 
  accent: "#e5e7eb",
  // ... other properties
}
```

**Warm Theme**: Cozy earth tones and browns
```typescript
colors: {
  primary: "#92400e",
  background: "#fffbf5",
  accent: "#fed7aa", 
  // ... other properties
}
```

**Cool Theme**: Modern blue accents and clean grays
```typescript
colors: {
  primary: "#1e40af",
  background: "#fefeff",
  accent: "#bae6fd",
  // ... other properties  
}
```

### File Structure

```
apps/web/src/
├── components/
│   ├── theme-provider.tsx       # Main theme management
│   └── theme-switcher.tsx      # UI for theme switching
├── lib/
│   └── theme-utils.ts          # Theme utility functions
├── types/
│   └── store-config.ts         # TypeScript definitions
├── data/
│   └── sample-stores.ts        # Pre-configured store examples
└── app/[storefront]/
    ├── page.tsx               # Updated storefront page
    └── components/            # Theme-aware components
        ├── header.tsx
        ├── hero.tsx
        ├── categories.tsx
        ├── featured.tsx
        └── ...
```

## Usage

### 1. Basic Theme Provider Setup

```typescript
import { StoreThemeProvider } from "../../components/theme-provider";

export default function StorefrontPage() {
  return (
    <StoreThemeProvider 
      defaultVariant="cool"
      storeId="your-store-id"
    >
      {/* Your storefront components */}
    </StoreThemeProvider>
  );
}
```

### 2. Using Theme-Aware Components

```typescript
import { cn, themeClasses } from "../../lib/theme-utils";

function MyComponent() {
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      themeClasses.background.card,
      themeClasses.border.default
    )}>
      <h2 className={cn("text-xl font-semibold", themeClasses.text.primary)}>
        Themed Content
      </h2>
    </div>
  );
}
```

### 3. Adding Theme Switcher

```typescript
import { FloatingThemeSwitcher } from "../../components/theme-switcher";

// Add anywhere in your component tree
<FloatingThemeSwitcher />
```

### 4. Creating Store Configurations

```typescript
import { StoreConfiguration } from "../types/store-config";

const MY_STORE: StoreConfiguration = {
  id: "my_store_001",
  name: "My Store",
  themeVariant: "minimal", // or "warm" or "cool"
  content: {
    header: { /* header config */ },
    hero: { /* hero config */ },
    categories: { /* categories config */ },
    featured: { /* featured config */ },
    footer: { /* footer config */ }
  }
};
```

## Available Theme Classes

### Background Variants
- `themeClasses.background.default` - Main page background
- `themeClasses.background.card` - Card/container backgrounds  
- `themeClasses.background.muted` - Subtle backgrounds
- `themeClasses.background.accent` - Accent backgrounds
- `themeClasses.background.primary` - Primary brand background

### Text Variants
- `themeClasses.text.default` - Default text color
- `themeClasses.text.muted` - Subdued text
- `themeClasses.text.primary` - Brand color text
- `themeClasses.text.secondary` - Secondary text

### Interactive States
- `themeClasses.hover.accent` - Accent hover states
- `themeClasses.hover.primary` - Primary hover states
- `themeClasses.focus.ring` - Focus ring styles

### Borders & Effects
- `themeClasses.border.default` - Standard borders
- `themeClasses.border.primary` - Primary color borders
- `themeClasses.shadow.sm` - Small shadows
- `themeClasses.shadow.md` - Medium shadows

## Sample Store Configurations

Three pre-built store configurations demonstrate different theme applications:

### 1. Minimal Store (`MINIMAL_STORE`)
- **Theme**: Minimal (black & white)
- **Brand**: "Minimalist Boutique"
- **Focus**: Clean, timeless design

### 2. Warm Store (`WARM_STORE`) 
- **Theme**: Warm (earth tones)
- **Brand**: "Cozy Corner"  
- **Focus**: Comfort and seasonal items

### 3. Cool Store (`COOL_STORE`)
- **Theme**: Cool (blue accents)
- **Brand**: "Urban Edge"
- **Focus**: Professional and tech-forward

## Advanced Features

### Per-Store Persistence
Themes are automatically saved to `localStorage` with the key pattern:
```
`vendly-theme-${storeId}`
```

### Dynamic CSS Variables
The theme system injects CSS variables that can be used throughout your application:
- `--color-primary`
- `--color-background`
- `--color-accent`
- `--radius`
- `--shadow-sm`
- etc.

### Custom Theme Extensions
You can extend themes by adding custom CSS:
```css
.my-custom-component {
  background: var(--color-accent);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
```

## Testing & Development

### Theme Switcher
The `FloatingThemeSwitcher` component provides an interactive way to test themes:
- Floating button in bottom-right corner
- Visual theme previews
- Real-time switching
- Persistence indicator

### Development Workflow
1. Create/modify theme definitions in `theme-provider.tsx`
2. Update theme classes in `theme-utils.ts` 
3. Apply theme classes to components using `cn()` utility
4. Test with the theme switcher component
5. Verify persistence across browser sessions

## Components Updated

All major storefront components have been updated with theme support:
- ✅ **Header**: Navigation, logo, icons with theme colors
- ✅ **Hero**: Background overlays and CTA buttons  
- ✅ **Categories**: Card backgrounds and text colors
- ✅ **Featured**: Interactive overlays and buttons
- ✅ **Main Page**: Background and text color integration

## Next Steps

### Immediate
1. **Test the implementation**: Use the theme switcher to verify all components respond correctly
2. **Add remaining components**: Update product cards, footer, and any other components
3. **Fine-tune colors**: Adjust theme colors based on design requirements

### Future Enhancements
1. **Theme Editor**: Build a visual theme customization interface
2. **More Theme Variants**: Add seasonal or industry-specific themes
3. **Advanced Persistence**: Store themes in database for logged-in users
4. **Theme Analytics**: Track which themes are most popular
5. **Custom CSS Upload**: Allow stores to upload completely custom CSS

## Troubleshooting

### Theme Not Applying
- Ensure `StoreThemeProvider` wraps your components
- Check that CSS variables are being injected (inspect element)
- Verify `storeId` is provided for persistence

### Styling Issues  
- Use browser dev tools to inspect CSS variable values
- Ensure theme classes are applied correctly with `cn()` utility
- Check for CSS specificity conflicts

### Performance
- Theme switching is optimized for instant feedback
- CSS variables provide efficient theme changes
- LocalStorage persistence is lightweight

---

**Built with inspiration from tweakcn concepts for a flexible, maintainable theming system.**
