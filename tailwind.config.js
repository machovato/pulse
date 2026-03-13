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
            fontSize: {
                "slide-title": "var(--type-slide-title)",
                "slide-subtitle": "var(--type-slide-subtitle)",
                headline: "var(--type-headline)",
                "card-title": "var(--type-card-title)",
                "card-body": "var(--type-card-body)",
                "metric-lg": "var(--type-metric-large)",
                "metric-md": "var(--type-metric-medium)",
                "metric-unit": "var(--type-metric-unit)",
                badge: "var(--type-badge)",
                caption: "var(--type-caption)",
            },
            borderWidth: {
                card: "var(--border-width-card)",
                accent: "var(--border-width-accent)",
                timeline: "var(--border-width-timeline)",
            },
            padding: {
                card: "var(--spacing-card-padding)",
                slide: "var(--spacing-slide-padding)",
            },
            gap: {
                card: "var(--spacing-card-gap)",
                section: "var(--spacing-section-gap)",
            },
            colors: {
                accent: {
                    DEFAULT: "var(--accent-primary)",
                    primary: "var(--accent-primary)",
                    "primary-bg": "var(--accent-primary-bg)",
                    success: "var(--accent-success)",
                    warning: "var(--accent-warning)",
                    danger: "var(--accent-danger)",
                    vault: "var(--accent-vault)",
                    "template-status": "var(--accent-template-status)",
                    "template-strategy": "var(--accent-template-strategy)",
                    "template-kickoff": "var(--accent-template-kickoff)",
                    info: "var(--accent-info)",
                    progress: "var(--accent-progress)",
                },
                surface: {
                    primary: "var(--surface-primary)",
                    secondary: "var(--surface-secondary)",
                    dark: "var(--surface-dark)",
                    subtle: "var(--surface-subtle)",
                    glass: "var(--surface-glass)",
                    hero: "var(--surface-hero)",
                    muted: "var(--surface-muted)",
                    page: "var(--surface-page)",
                    split: "var(--surface-split)",
                    "split-alt": "var(--surface-split-alt)",
                },
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                    tertiary: "var(--text-tertiary)",
                    "on-dark": "var(--text-on-dark)",
                    "on-dark-muted": "var(--text-on-dark-muted)",
                    "on-hero": "var(--text-on-hero)",
                    muted: "var(--text-muted)",
                    "on-emphasis": "var(--text-on-emphasis)",
                },
                border: {
                    DEFAULT: "var(--border-default)",
                    subtle: "var(--border-subtle)",
                    "on-dark": "var(--border-on-dark)",
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
                sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                card: "var(--border-radius-card)",
                badge: "var(--border-radius-badge)",
            },
            animation: {
                ripple: "ripple 1.5s ease-out infinite",
                "fade-up": "fadeUp 0.4s ease forwards",
                "pulse-cta": "pulseCta 2s ease-in-out infinite",
            },
            boxShadow: {
                card: "0 4px 20px rgba(0,0,0,0.06)",
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
