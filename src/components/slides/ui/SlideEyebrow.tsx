"use client";

import { useTemplate } from "@/components/TemplateContext";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

interface SlideEyebrowProps {
    slideData?: Record<string, any>;
    deckMeta?: Record<string, string>;
    className?: string;
}

const TEMPLATE_DEFAULTS: Record<string, string> = {
    status: "Project Update",
    strategy: "Strategy Briefing",
    kickoff: "Leadership Briefing",
    allHands: "All Hands",
    requirements: "Requirements",
    custom: "Custom Presentation"
};

export function SlideEyebrow({ slideData, deckMeta, className }: SlideEyebrowProps) {
    const { template } = useTemplate();
    const finalClass = cn("dtn-eyebrow inline-flex", className);
    
    // 1. Check slide-specific eyebrow
    if (slideData?.eyebrow) {
        return <Typography variant="eyebrow" className={finalClass}>{slideData.eyebrow}</Typography>;
    }
    
    // 2. Check deck-level eyebrow
    if (deckMeta?.eyebrow) {
        return <Typography variant="eyebrow" className={finalClass}>{deckMeta.eyebrow}</Typography>;
    }
    
    // 3. Fallback to template default
    const fallback = TEMPLATE_DEFAULTS[template] || "Presentation";
    
    return <Typography variant="eyebrow" className={finalClass}>{fallback}</Typography>;
}
