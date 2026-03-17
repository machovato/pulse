/**
 * TEMPLATE REGISTRY — Single source of truth for template definitions.
 *
 * This replaces the split between:
 * - src/lib/templates.ts (TEMPLATES config — partial, missing strategy/kickoff)
 * - src/lib/schema.ts (Zod enum — had strategy/kickoff but no behavior)
 * - SlideEyebrow TEMPLATE_DEFAULTS (had eyebrow labels, missing standup)
 * - DeckList TEMPLATE_LABELS (had display names separately)
 *
 * HOW TO ADD A NEW TEMPLATE:
 * 1. Add the name to TemplateName union below
 * 2. Add an entry to TEMPLATE_REGISTRY
 * 3. Add it to the Zod enum in src/lib/schema.ts
 * 4. Add it to src/lib/repair.ts valid templates array
 * 5. Add personality tokens to src/styles/globals.css (copy from status block)
 * 6. Add its [data-template] [data-layout] bridge rules in globals.css
 * 7. Add it to TEMPLATE_STYLES and TEMPLATE_LABELS in src/app/(app)/DeckList.tsx
 *
 * No theme file changes required.
 */

export type TemplateName =
  | "status"
  | "standup"
  | "allHands"
  | "strategy"
  | "kickoff"
  | "requirements"
  | "custom";

export type ThemeName = "blue" | "obsidian" | "ember" | "tide" | "crimson";

export type SlideGroup = "primary" | "secondary";

export interface TemplateDefinition {
  id: TemplateName;
  /** Human-readable label for UI display */
  label: string;
  /** Short description for editor/help text */
  description: string;
  /** Default eyebrow text shown on slides when no override is set */
  defaultEyebrow: string;
  /** Default theme for new decks created with this template */
  defaultTheme: ThemeName;
  /** Slide types this template is intended to use (non-blocking — just guidance) */
  allowedSlideTypes: string[];
  /** Suggested slide order for new decks */
  defaultOrder: string[];
}

export const TEMPLATE_REGISTRY: Record<TemplateName, TemplateDefinition> = {
  status: {
    id: "status",
    label: "Status",
    description: "Weekly sprint and project status update",
    defaultEyebrow: "Project Update",
    defaultTheme: "blue",
    allowedSlideTypes: ["hero", "kpis", "pipeline", "grid", "timeline", "blockers"],
    defaultOrder: ["hero", "kpis", "pipeline", "timeline", "grid", "blockers"],
  },
  standup: {
    id: "standup",
    label: "Standup",
    description: "Scrum standup or daily sync meeting",
    defaultEyebrow: "Daily Standup",
    defaultTheme: "tide",
    allowedSlideTypes: ["hero", "kpis", "pipeline", "blockers", "grid"],
    defaultOrder: ["hero", "kpis", "blockers", "pipeline"],
  },
  allHands: {
    id: "allHands",
    label: "All Hands",
    description: "Company or team all-hands meeting",
    defaultEyebrow: "All Hands",
    defaultTheme: "blue",
    allowedSlideTypes: ["hero", "kpis", "agenda", "grid", "callout", "blockers"],
    defaultOrder: ["hero", "agenda", "kpis", "grid", "callout", "blockers"],
  },
  strategy: {
    id: "strategy",
    label: "Strategy",
    description: "Leadership strategy briefing or OKR review",
    defaultEyebrow: "Strategy Briefing",
    defaultTheme: "obsidian",
    allowedSlideTypes: ["hero", "context", "problem", "evidence", "framework", "pipeline", "blockers", "grid", "callout"],
    defaultOrder: ["hero", "context", "problem", "evidence", "framework", "blockers"],
  },
  kickoff: {
    id: "kickoff",
    label: "Kickoff",
    description: "Project or initiative launch kickoff",
    defaultEyebrow: "Leadership Briefing",
    defaultTheme: "ember",
    allowedSlideTypes: ["hero", "context", "problem", "evidence", "grid", "timeline", "blockers", "pipeline", "callout", "decision_log"],
    defaultOrder: ["hero", "context", "problem", "evidence", "timeline", "blockers"],
  },
  requirements: {
    id: "requirements",
    label: "Requirements",
    description: "Requirements gathering or review session",
    defaultEyebrow: "Requirements",
    defaultTheme: "blue",
    allowedSlideTypes: ["hero", "agenda", "grid", "decision_log", "callout"],
    defaultOrder: ["hero", "agenda", "grid", "decision_log", "callout"],
  },
  custom: {
    id: "custom",
    label: "Custom",
    description: "All slide types, no default order",
    defaultEyebrow: "Presentation",
    defaultTheme: "blue",
    allowedSlideTypes: [
      "hero", "context", "problem", "evidence", "framework", "grid",
      "timeline", "pipeline", "blockers", "kpis", "callout", "agenda", "decision_log",
    ],
    defaultOrder: [],
  },
};

/** Get a template definition. Falls back to 'custom' for unknown template names. */
export function getTemplateDefinition(template: string): TemplateDefinition {
  return TEMPLATE_REGISTRY[template as TemplateName] ?? TEMPLATE_REGISTRY.custom;
}

/** Get all template names as an array */
export function getTemplateNames(): TemplateName[] {
  return Object.keys(TEMPLATE_REGISTRY) as TemplateName[];
}
