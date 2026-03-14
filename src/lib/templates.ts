import type { SlideType } from "./schema";

export type TemplateId = "status" | "standup" | "allHands" | "requirements" | "custom";

interface TemplateConfig {
    label: string;
    description: string;
    allowed: SlideType[] | "*";
    defaultOrder: SlideType[];
}

export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
    status: {
        label: "Status",
        description: "Weekly sprint and project status update",
        allowed: ["hero", "kpis", "pipeline", "grid", "timeline", "blockers"],
        defaultOrder: ["hero", "kpis", "pipeline", "timeline", "grid", "blockers"],
    },
    standup: {
        label: "Standup",
        description: "Scrum standup or daily sync meeting",
        allowed: ["hero", "kpis", "pipeline", "blockers", "grid"],
        defaultOrder: ["hero", "kpis", "blockers", "pipeline"],
    },
    allHands: {
        label: "All Hands",
        description: "Company or team all-hands meeting",
        allowed: ["hero", "kpis", "agenda", "grid", "callout", "blockers"],
        defaultOrder: ["hero", "agenda", "kpis", "grid", "callout", "blockers"],
    },
    requirements: {
        label: "Requirements",
        description: "Requirements gathering or review session",
        allowed: ["hero", "agenda", "grid", "decision_log", "callout"],
        defaultOrder: ["hero", "agenda", "grid", "decision_log", "callout"],
    },
    custom: {
        label: "Custom",
        description: "All slide types allowed, no default order",
        allowed: "*",
        defaultOrder: [],
    },
};

/**
 * Returns warning strings for slides that use types not allowed by the template.
 * Never blocks rendering — warnings only.
 */
export function getTemplateWarnings(
    slides: { type: string }[],
    templateId: string
): string[] {
    const template = TEMPLATES[templateId as TemplateId];
    if (!template || template.allowed === "*") return [];

    const warnings: string[] = [];
    slides.forEach((slide, idx) => {
        if (!(template.allowed as string[]).includes(slide.type)) {
            warnings.push(
                `Slide ${idx + 1}: type "${slide.type}" is not in the ${templateId} template's allowed list. It will still render.`
            );
        }
    });
    return warnings;
}

/**
 * Reorders slides to match the template's default order.
 * Slides not in the template's order are appended at the end.
 */
export function suggestOrder<T extends { type: string }>(
    slides: T[],
    templateId: string
): T[] {
    const template = TEMPLATES[templateId as TemplateId];
    if (!template || template.allowed === "*") return slides;

    const ordered: T[] = [];
    const remaining = [...slides];

    for (const type of template.defaultOrder) {
        const idx = remaining.findIndex((s) => s.type === type);
        if (idx !== -1) {
            ordered.push(remaining.splice(idx, 1)[0]);
        }
    }

    return [...ordered, ...remaining];
}
