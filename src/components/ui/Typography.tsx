import * as React from "react";
import { cn } from "@/lib/utils";

export type TypographyVariant =
    | "display"
    | "eyebrow"
    | "h1"
    | "h2"
    | "subtitle"
    | "body"
    | "metric"
    | "metric-medium"
    | "metric-unit"
    | "caption"
    | "badge";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant: TypographyVariant;
    children: React.ReactNode;
    as?: React.ElementType;
}

const variantConfig: Record<
    TypographyVariant,
    { element: React.ElementType; className: string; style?: React.CSSProperties }
> = {
    display: {
        element: "h1",
        className: "tracking-tight drop-shadow-sm max-w-5xl",
        style: {
            fontSize: "var(--type-display)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em"
        },
    },
    eyebrow: {
        element: "span",
        className: "pulse-eyebrow uppercase font-semibold opacity-60 truncate block max-w-full",
        style: { fontSize: "var(--type-eyebrow)", letterSpacing: "0.18em" },
    },
    h1: {
        element: "h1",
        className: "pulse-slide-title",
        style: {
            fontSize: "var(--type-slide-title)",
            fontWeight: "var(--font-weight-title)",
        },
    },
    h2: {
        element: "h2",
        className: "",
        style: {
            fontSize: "var(--type-card-title)",
            fontWeight: "var(--font-weight-card-title)",
        },
    },
    subtitle: {
        element: "p",
        className: "line-clamp-3",
        style: { fontSize: "var(--type-slide-subtitle)", fontWeight: 400 },
    },
    body: {
        element: "p",
        className: "line-clamp-4",
        style: {
            fontSize: "var(--type-card-body)",
            fontWeight: 400,
            color: "var(--text-secondary)",
        },
    },
    metric: {
        element: "span",
        className: "font-bold",
        style: {
            fontSize: "var(--type-metric-large)",
            color: "var(--text-primary)",
        },
    },
    "metric-medium": {
        element: "span",
        className: "font-bold",
        style: {
            fontSize: "var(--type-metric-medium)",
            color: "var(--text-primary)",
        },
    },
    "metric-unit": {
        element: "span",
        className: "uppercase opacity-60 truncate block max-w-full",
        style: { fontSize: "var(--type-metric-unit)", letterSpacing: "0.05em" },
    },
    caption: {
        element: "span",
        className: "line-clamp-2",
        style: { fontSize: "var(--type-caption)", color: "var(--text-muted)" },
    },
    badge: {
        element: "span",
        className: "uppercase font-semibold truncate block max-w-full",
        style: { fontSize: "var(--type-badge)", letterSpacing: "0.05em" },
    },
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ variant, children, className, as, style, ...props }, ref) => {
        const config = variantConfig[variant];
        const Component = as || config.element;

        return (
            <Component
                ref={ref}
                className={cn(config.className, className)}
                style={{ ...config.style, ...style }}
                {...props}
            >
                {children}
            </Component>
        );
    }
);
Typography.displayName = "Typography";
