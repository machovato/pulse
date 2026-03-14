"use client";

import { useTemplate } from "@/components/TemplateContext";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import { getTemplateDefinition } from "@/config/templateRegistry";

interface SlideEyebrowProps {
    slideData?: Record<string, any>;
    deckMeta?: Record<string, string>;
    className?: string;
}

export function SlideEyebrow({ slideData, deckMeta, className }: SlideEyebrowProps) {
    const { template } = useTemplate();
    const finalClass = cn("pulse-eyebrow inline-flex", className);

    // 1. Check slide-specific eyebrow
    if (slideData?.eyebrow) {
        return <Typography variant="eyebrow" className={finalClass}>{slideData.eyebrow}</Typography>;
    }

    // 2. Check deck-level eyebrow
    if (deckMeta?.eyebrow) {
        return <Typography variant="eyebrow" className={finalClass}>{deckMeta.eyebrow}</Typography>;
    }

    // 3. Fallback to template default from registry
    const fallback = getTemplateDefinition(template).defaultEyebrow;

    return <Typography variant="eyebrow" className={finalClass}>{fallback}</Typography>;
}
