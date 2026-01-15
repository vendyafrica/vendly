// Helper maps for layout tokens
const RADIUS_MAP: Record<string, string> = {
    none: '0',
    small: '0.2rem',
    medium: '0.5rem',
    large: '1rem',
    full: '9999px',
}

const SPACING_MAP: Record<string, string> = {
    compact: '0.5',
    normal: '1',
    relaxed: '1.5',
}

const CONTAINER_MAP: Record<string, string> = {
    narrow: '800px',
    normal: '1200px',
    wide: '1400px',
    full: '100%',
}

function toCssVarName(key: string) {
    return key.startsWith('--') ? key : `--${key}`
}

interface DesignSystem {
    colors?: {
        primary?: { hex?: string }
        secondary?: { hex?: string }
        background?: { hex?: string }
        foreground?: { hex?: string }
        accent?: { hex?: string }
        muted?: { hex?: string }
        mutedForeground?: { hex?: string }
        border?: { hex?: string }
    }
    typography?: {
        headingFont?: string
        bodyFont?: string
        baseFontSize?: number
    }
    layout?: {
        borderRadius?: string
        spacing?: string
        containerWidth?: string
    }
}

export function buildCssVarsFromDesignSystem(
    designSystem: DesignSystem | null | undefined
): React.CSSProperties {
    if (!designSystem) return {}

    const style: Record<string, string> = {}

    // Colors
    if (designSystem.colors) {
        const colors = designSystem.colors
        if (colors.primary?.hex) style['--primary'] = colors.primary.hex
        if (colors.secondary?.hex) style['--secondary'] = colors.secondary.hex
        if (colors.background?.hex) style['--background'] = colors.background.hex
        if (colors.foreground?.hex) style['--foreground'] = colors.foreground.hex
        if (colors.accent?.hex) style['--accent'] = colors.accent.hex
        if (colors.muted?.hex) style['--muted'] = colors.muted.hex
        if (colors.mutedForeground?.hex) style['--muted-foreground'] = colors.mutedForeground.hex
        if (colors.border?.hex) style['--border'] = colors.border.hex
    }

    // Typography
    if (designSystem.typography) {
        const typography = designSystem.typography
        if (typography.headingFont) style['--font-heading'] = typography.headingFont
        if (typography.bodyFont) style['--font-body'] = typography.bodyFont
        if (typography.baseFontSize) style['--font-size-base'] = `${typography.baseFontSize}px`
    }

    // Layout
    if (designSystem.layout) {
        const layout = designSystem.layout
        if (layout.borderRadius && RADIUS_MAP[layout.borderRadius]) {
            style['--radius'] = RADIUS_MAP[layout.borderRadius]
        }
        if (layout.spacing && SPACING_MAP[layout.spacing]) {
            style['--spacing-factor'] = SPACING_MAP[layout.spacing]
        }
        if (layout.containerWidth && CONTAINER_MAP[layout.containerWidth]) {
            style['--container-max'] = CONTAINER_MAP[layout.containerWidth]
        }
    }

    // Ensure defaults
    if (!style['--background']) style['--background'] = '#ffffff'
    if (!style['--foreground']) style['--foreground'] = '#111111'
    if (!style['--primary']) style['--primary'] = '#111111'
    if (!style['--radius']) style['--radius'] = '0.5rem'

    return style as React.CSSProperties
}
