/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    safelist: [
        'bg-surface-split',
        'bg-surface-split-alt'
    ],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                /* ── Raw palette tokens ── use dtn.* names in components */
                dtn: {
                    // Primary
                    blue: "var(--dtn-blue)",
                    green: "var(--dtn-green)",
                    // Secondary
                    navy: "var(--dtn-navy)",
                    "blue-mid": "var(--dtn-blue-mid)",
                    "green-dark": "var(--dtn-green-dark)",
                    teal: "var(--dtn-teal)",
                    red: "var(--dtn-red)",
                    orange: "var(--dtn-orange)",
                    // Accent
                    cyan: "var(--dtn-cyan)",
                    lime: "var(--dtn-lime)",
                    yellow: "var(--dtn-yellow)",
                    // Neutral
                    "neutral-dark": "var(--dtn-neutral-dark)",
                    "neutral-mid": "var(--dtn-neutral-mid)",
                    "neutral-light": "var(--dtn-neutral-light)",
                    "neutral-bg": "var(--dtn-neutral-bg)",
                    // Legacy aliases (backwards compat)
                    neutral: "var(--dtn-navy)",
                    muted: "var(--dtn-neutral-dark)",
                    bg: "var(--dtn-neutral-bg)",
                },
                /* ── Semantic role tokens ── prefer these over raw tokens */
                brand: "var(--color-brand)",
                interactive: "var(--color-interactive)",
                success: "var(--color-success)",
                warning: "var(--color-warning)",
                danger: "var(--color-error)",
                accent: {
                    DEFAULT: "var(--color-accent)",
                    success: "var(--accent-success)",
                    warning: "var(--accent-warning)",
                    danger: "var(--accent-danger)",
                    info: "var(--accent-info)",
                    progress: "var(--accent-progress)",
                },
                surface: {
                    hero: "var(--surface-hero)",
                    primary: "var(--surface-primary)",
                    secondary: "var(--surface-secondary)",
                    muted: "var(--surface-muted)",
                    page: "var(--surface-page)",
                    split: "var(--surface-split)",
                    "split-alt": "var(--surface-split-alt)",
                },
                text: {
                    "on-hero": "var(--text-on-hero)",
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                    muted: "var(--text-muted)",
                    "on-emphasis": "var(--text-on-emphasis)",
                },
                border: {
                    DEFAULT: "var(--border-default)",
                    strong: "var(--border-strong)",
                    muted: "var(--border-muted)",
                },
                badge: {
                    "critical-bg": "var(--badge-critical-bg)",
                    "critical-text": "var(--badge-critical-text)",
                    "high-bg": "var(--badge-high-bg)",
                    "high-text": "var(--badge-high-text)",
                    "moderate-bg": "var(--badge-moderate-bg)",
                    "moderate-text": "var(--badge-moderate-text)",
                    "action-bg": "var(--badge-action-bg)",
                    "action-text": "var(--badge-action-text)",
                    "approval-bg": "var(--badge-approval-bg)",
                    "approval-text": "var(--badge-approval-text)",
                    "fyi-bg": "var(--badge-fyi-bg)",
                    "fyi-text": "var(--badge-fyi-text)",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            animation: {
                ripple: "ripple 1.5s ease-out infinite",
                "fade-up": "fadeUp 0.4s ease forwards",
                "pulse-cta": "pulseCta 2s ease-in-out infinite",
            },
            keyframes: {
                ripple: {
                    "0%": { transform: "scale(1)", opacity: "0.6" },
                    "100%": { transform: "scale(2)", opacity: "0" },
                },
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(12px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                pulseCta: {
                    // Use official DTN Blue for the pulse glow
                    "0%, 100%": { boxShadow: "0 0 0 0 rgba(27, 143, 224, 0.4)" },
                    "50%": { boxShadow: "0 0 0 8px rgba(27, 143, 224, 0)" },
                },
            },
        },
    },
    plugins: [],
};
