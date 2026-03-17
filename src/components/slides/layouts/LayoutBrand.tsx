/**
 * Layout 1 — Full-Bleed Brand
 * Applied to: hero
 *
 * Full-viewport gradient hero. Geometric motif upper-right at low opacity.
 * The motif shape is driven by template context (circles, squares, triangles, lines).
 * Children rendered over the gradient.
 */
"use client";

import { useTemplate } from "@/components/TemplateContext";
import { HeroDecoration, TEMPLATE_DECORATION } from "../HeroDecoration";

interface LayoutBrandProps {
    children: React.ReactNode;
}

export function LayoutBrand({ children }: LayoutBrandProps) {
    const { template } = useTemplate();
    const variant = TEMPLATE_DECORATION[template] ?? "circles";

    return (
        <div
            data-layout="hero"
            className="relative w-full h-full overflow-hidden"
            style={{ background: "var(--surface-hero)" }}
        >
            {/* Geometric motif — upper right, large and subtle */}
            <HeroDecoration
                variant={variant}
                color="white"
                opacity={0.9}
                className="absolute -top-1/4 -right-1/4 w-[70%] h-[70%] pointer-events-none"
            />

            {/* Content layer */}
            <div className="relative z-10 w-full h-full flex flex-col">
                {children}
            </div>
        </div>
    );
}
