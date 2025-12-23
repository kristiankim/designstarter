import { Constraint, DesignFeel, ProductType } from "./store";

export type SystemFamily = 'clarity' | 'brand' | 'friendly';

export interface DesignTokens {
    typography: {
        fontFamily: {
            base: string;
            display?: string;
        };
        weights: Record<string, number>;
        scale: {
            h1: string;
            h2: string;
            h3: string;
            body: string;
            bodySmall: string;
            helper: string;
        };
        lineHeight: Record<string, string | number>;
        letterSpacing: Record<string, string>;
    };
    colors: {
        neutral: string[];
        brand: {
            primary: string;
            secondary: string;
            tertiary: string;
        };
        semantic: {
            success: string;
            warning: string;
            danger: string;
            info: string;
        };
    };
    grid: {
        desktop: { columns: number; gutter: string; margin: string };
        mobile: { columns: number; gutter: string; margin: string };
        space: string[];
    };
}

export interface GenerationResult {
    family: SystemFamily;
    tokens: DesignTokens;
    rationale: string;
}

const FAMILIES: Record<SystemFamily, any> = {
    clarity: {
        fonts: [
            { base: "'Inter', sans-serif", display: "'Inter', sans-serif" },
            { base: "'General Sans', sans-serif", display: "'General Sans', sans-serif" },
            { base: "'Satoshi', sans-serif", display: "'Satoshi', sans-serif" },
        ],
        themes: [
            { primary: "#0F172A" },
            { primary: "#1E3A8A" },
            { primary: "#111827" },
        ],
        grid: { desktop: 12, mobile: 4, gutter: "24px", margin: "40px", spaceBase: 4 },
    },
    brand: {
        fonts: [
            { base: "'Inter', sans-serif", display: "'Clash Display', sans-serif" },
            { base: "'Outfit', sans-serif", display: "'Playfair Display', serif" },
            { base: "'Satoshi', sans-serif", display: "'Cabinet Grotesk', sans-serif" },
        ],
        themes: [
            { primary: "#7C3AED" },
            { primary: "#DB2777" },
            { primary: "#2563EB" },
        ],
        grid: { desktop: 12, mobile: 4, gutter: "32px", margin: "64px", spaceBase: 8 },
    },
    friendly: {
        fonts: [
            { base: "'Outfit', sans-serif", display: "'Outfit', sans-serif" },
            { base: "'Quicksand', sans-serif", display: "'Quicksand', sans-serif" },
            { base: "'Plus Jakarta Sans', sans-serif", display: "'Plus Jakarta Sans', sans-serif" },
        ],
        themes: [
            { primary: "#F59E0B" },
            { primary: "#10B981" },
            { primary: "#F43F5E" },
        ],
        grid: { desktop: 12, mobile: 4, gutter: "20px", margin: "24px", spaceBase: 8 },
    },
};

// Helper to shift hue for complementary colors
function shiftHue(hex: string, degree: number): string {
    // Simple hex to HSL and back is complex without a library, 
    // but I can provide a few pre-calculated complements or use a very basic logic.
    // For the sake of this task, I'll use a set of complementary colors mapped to primaries.
    const complements: Record<string, string[]> = {
        "#0F172A": ["#334155", "#64748B"],
        "#1E3A8A": ["#3B82F6", "#93C5FD"],
        "#111827": ["#374151", "#6B7280"],
        "#7C3AED": ["#C084FC", "#E9D5FF"],
        "#DB2777": ["#F472B6", "#FBCFE8"],
        "#2563EB": ["#60A5FA", "#BFDBFE"],
        "#F59E0B": ["#FBBF24", "#FDE68A"],
        "#10B981": ["#34D399", "#A7F3D0"],
        "#F43F5E": ["#FB7185", "#FECDD3"],
    };
    return complements[hex]?.[degree - 1] || hex;
}

export function generateSystem(
    answers: {
        productType: ProductType | null;
        feel: DesignFeel | null;
        constraint: Constraint | null;
        advanced: { primarySurface: string; brandVibe: number; supportMode: string };
    },
    seeds: { typography: number; color: number }
): GenerationResult {
    // 1. Scoring Logic
    let scores = { clarity: 0, brand: 0, friendly: 0 };

    if (answers.productType === 'saas' || answers.productType === 'internal' || answers.productType === 'devtool') {
        scores.clarity += 60;
    } else if (answers.productType === 'marketing' || answers.productType === 'ecommerce') {
        scores.brand += 60;
    } else if (answers.productType === 'consumer') {
        scores.friendly += 60;
    }

    if (answers.feel === 'technical' || answers.feel === 'calm') scores.clarity += 40;
    if (answers.feel === 'bold' || answers.feel === 'elegant') scores.brand += 40;
    if (answers.feel === 'playful') scores.friendly += 40;

    const family = (Object.keys(scores) as SystemFamily[]).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const data = FAMILIES[family];

    // 2. Variant Selection
    const fontIdx = seeds.typography % data.fonts.length;
    const themeIdx = seeds.color % data.themes.length;

    const selectedFont = data.fonts[fontIdx];
    const selectedTheme = data.themes[themeIdx];

    // 3. Tokens Construction
    const tokens: DesignTokens = {
        typography: {
            fontFamily: selectedFont,
            weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
            scale: {
                h1: "3.5rem",
                h2: "2.5rem",
                h3: "1.75rem",
                body: "1rem",
                bodySmall: "0.875rem",
                helper: "0.75rem"
            },
            lineHeight: {
                tight: 1.1,
                snug: 1.3,
                relaxed: 1.6
            },
            letterSpacing: {
                tight: "-0.02em",
                normal: "0",
                wide: "0.02em"
            }
        },
        colors: {
            neutral: ["#F8FAFC", "#F1F5F9", "#E2E8F0", "#94A3B8", "#64748B", "#475569", "#334155", "#1E293B", "#0F172A"],
            brand: {
                primary: selectedTheme.primary,
                secondary: shiftHue(selectedTheme.primary, 1),
                tertiary: shiftHue(selectedTheme.primary, 2)
            },
            semantic: {
                success: "#10B981",
                warning: "#F59E0B",
                danger: "#EF4444",
                info: "#3B82F6"
            }
        },
        grid: {
            desktop: { columns: data.grid.desktop, gutter: data.grid.gutter, margin: data.grid.margin },
            mobile: { columns: data.grid.mobile, gutter: "16px", margin: "16px" },
            space: Array.from({ length: 10 }, (_, i) => `${(i + 1) * data.grid.spaceBase}px`)
        }
    };

    let rationale = "Optimizing for readability in data-heavy UI...";
    if (family === 'brand') rationale = "Enhancing visual impact and brand presence...";
    if (family === 'friendly') rationale = "Creating an approachable and welcoming experience...";

    return { family, tokens, rationale };
}
