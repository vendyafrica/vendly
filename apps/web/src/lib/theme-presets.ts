export interface ThemePreset {
    id: string;
    name: string;
    description: string;
    preview: string[];
    colors: {
        primary: string;
        secondary: string;
        background: string;
        foreground: string;
        muted: string;
        mutedForeground: string;
        border: string;
        input: string;
        ring: string;
    };
    typography: {
        fontFamily: string;
        headingFont: string;
        bodyFont: string;
    };
    layout: {
        borderRadius: "none" | "small" | "medium" | "large";
        containerWidth: "narrow" | "normal" | "wide" | "full";
    };
    components: {
        buttonStyle: "solid" | "outline" | "ghost";
        cardStyle: "elevated" | "bordered" | "flat";
    };
}

export const THEME_PRESETS: ThemePreset[] = [
    {
        id: 'velasca',
        name: 'Velasca',
        description: 'A sophisticated palette defined by cream, grays, and a cool blue tone reminiscent of the Mediterranean Sea.',
        preview: ['#285570', '#e3ded7', '#faf7f6', '#cbcac7', '#333333'],
        colors: {
            primary: '#285570',
            secondary: '#e3ded7',
            background: '#faf7f6',
            foreground: '#333333',
            muted: '#e3ded7',
            mutedForeground: '#666666',
            border: '#cbcac7',
            input: '#ffffff',
            ring: '#285570',
        },
        typography: {
            fontFamily: 'Inter',
            headingFont: 'Playfair Display',
            bodyFont: 'Inter',
        },
        layout: {
            borderRadius: 'none',
            containerWidth: 'wide',
        },
        components: {
            buttonStyle: 'solid',
            cardStyle: 'flat',
        }
    }
];

export function getThemeById(id: string): ThemePreset | undefined {
    return THEME_PRESETS.find((theme) => theme.id === id);
}
