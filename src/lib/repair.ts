import type { Deck, LooseSlide } from "./schema";

// ─── Structural Repair ────────────────────────────────────────────────────────
// Fixes shape/schema issues only, preserves all string values.

const DEFAULT_SLIDE_DATA: Record<string, unknown> = {
    hero: {},
    kpis: { items: [] },
    pipeline: { steps: [] },
    grid: { cards: [] },
    timeline: { milestones: [] },
    blockers: { items: [] },
    callout: { text: "" },
    agenda: { items: [] },
    decision_log: { items: [] },
};

type AnyObj = Record<string, unknown>;

function coerceMeta(raw: AnyObj): AnyObj {
    const meta = { ...(raw.meta as AnyObj || {}) };

    // date: ensure YYYY-MM-DD
    if (typeof meta.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) {
        meta.date = new Date().toISOString().slice(0, 10);
    }

    // audience: enum
    const audiences = ["exec", "team", "customer", "mixed"] as const;
    if (!audiences.includes(meta.audience as typeof audiences[number])) {
        meta.audience = "team";
    }

    // template: enum
    const templates = ["status", "standup", "allHands", "requirements", "strategy", "custom", "kickoff"] as const;
    if (!templates.includes(meta.template as typeof templates[number])) {
        meta.template = "custom";
    }

    // rag: optional enum
    const rags = ["green", "yellow", "red"];
    if (meta.rag && !rags.includes(meta.rag as string)) {
        delete meta.rag;
    }

    // title: required
    if (!meta.title || typeof meta.title !== "string") {
        meta.title = "Untitled Deck";
    }

    return meta;
}

function coerceSlide(raw: AnyObj, idx: number): AnyObj {
    const type = typeof raw.type === "string" ? raw.type : "grid";
    const title = typeof raw.title === "string" ? raw.title : `Slide ${idx + 1}`;
    const defaultData = DEFAULT_SLIDE_DATA[type] ?? {};

    let data = raw.data as AnyObj || {};

    // Ensure required array keys exist
    const arrayKey: Record<string, string> = {
        kpis: "items",
        pipeline: "steps",
        grid: "cards",
        timeline: "milestones",
        blockers: "items",
        agenda: "items",
        decision_log: "items",
    };

    if (arrayKey[type] && !Array.isArray((data as AnyObj)[arrayKey[type]])) {
        data = { ...(defaultData as AnyObj), ...data, [arrayKey[type]]: [] };
    }

    // callout: ensure text
    if (type === "callout" && typeof (data as AnyObj).text !== "string") {
        data = { ...data, text: "" };
    }

    return { type, title, data, id: raw.id, notes: raw.notes };
}

export function structuralRepair(raw: unknown): { fixed: unknown; changes: string[] } {
    const changes: string[] = [];
    let obj = raw as AnyObj;

    // Ensure schemaVersion
    if ((obj.schemaVersion as number) !== 2) {
        changes.push("Set schemaVersion to 2");
        obj = { ...obj, schemaVersion: 2 };
    }

    // Repair meta
    const repairedMeta = coerceMeta(obj);
    if (JSON.stringify(repairedMeta) !== JSON.stringify(obj.meta)) {
        changes.push("Repaired meta fields");
        obj = { ...obj, meta: repairedMeta };
    }

    // Repair slides
    if (!Array.isArray(obj.slides)) {
        changes.push("Added empty slides array");
        obj = { ...obj, slides: [] };
    } else {
        const repairedSlides = (obj.slides as AnyObj[]).map((s, i) => coerceSlide(s, i));
        obj = { ...obj, slides: repairedSlides };
        changes.push(`Repaired ${repairedSlides.length} slide(s)`);
    }

    return { fixed: obj, changes };
}

// ─── Content Repair ───────────────────────────────────────────────────────────
// Structural repair + text normalization (capitalize, trim, etc.)

function normalizeText(s: string): string {
    if (!s) return s;
    const trimmed = s.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function repairSlideContent(slide: AnyObj): AnyObj {
    const data = slide.data as AnyObj || {};
    const arrayKey: Record<string, string> = {
        kpis: "items",
        pipeline: "steps",
        grid: "cards",
        timeline: "milestones",
        blockers: "items",
        agenda: "items",
        decision_log: "items",
    };

    const key = arrayKey[slide.type as string];
    if (key && Array.isArray(data[key])) {
        return {
            ...slide,
            title: normalizeText(slide.title as string),
            data: {
                ...data,
                [key]: (data[key] as AnyObj[]).map((item) => {
                    const out: AnyObj = {};
                    for (const [k, v] of Object.entries(item)) {
                        out[k] = typeof v === "string" ? normalizeText(v) : v;
                    }
                    return out;
                }),
            },
        };
    }

    if (slide.type === "callout" && typeof data.text === "string") {
        return { ...slide, data: { ...data, text: normalizeText(data.text) } };
    }

    return { ...slide, title: normalizeText(slide.title as string) };
}

export function contentRepair(raw: unknown): { fixed: unknown; changes: string[] } {
    const { fixed: afterStructural, changes: structuralChanges } = structuralRepair(raw);
    const obj = afterStructural as AnyObj;

    const repairedSlides = ((obj.slides as AnyObj[]) || []).map(repairSlideContent);
    return {
        fixed: { ...obj, slides: repairedSlides },
        changes: [...structuralChanges, "Normalized text casing and whitespace"],
    };
}
