import type { LooseSlide } from "./schema";

export type DensityMode = "executive" | "full";

const PAGINATION_THRESHOLD = 4;
const BLOCKERS_CAP = 6;

// Keys in slide data that contain arrays to paginate
const ARRAY_KEYS: Record<string, string> = {
    kpis: "items",
    pipeline: "steps",
    grid: "cards",
    timeline: "milestones",
    blockers: "items",
    agenda: "items",
    decision_log: "items",
    context: "cards",
    problem: "cards",
    evidence: "cards",
    framework: "cards",
    roadmap: "milestones",
};

/**
 * Applies density mode: trims arrays to 3 items for executive mode.
 */
export function applyDensity(slide: LooseSlide, density: DensityMode): LooseSlide {
    if (density === "full") return slide;

    const key = ARRAY_KEYS[slide.type];
    const skipTypes = ["timeline", "pipeline", "roadmap", "context", "problem", "evidence", "framework"];
    if (!key || !slide.data || skipTypes.includes(slide.type)) return slide;

    const arr = (slide.data as Record<string, unknown>)[key];
    if (!Array.isArray(arr)) return slide;

    return {
        ...slide,
        data: {
            ...(slide.data as Record<string, unknown>),
            [key]: arr.slice(0, 3),
        },
    };
}

/**
 * Paginates a single slide's array data into multiple slides.
 * Returns 1 or more slides ready for rendering.
 */
function paginateSlide(slide: LooseSlide): LooseSlide[] {
    const key = ARRAY_KEYS[slide.type];
    const skipTypes = ["timeline", "pipeline", "roadmap", "context", "problem", "evidence", "framework"];
    if (!key || !slide.data || skipTypes.includes(slide.type)) return [slide];

    const data = slide.data as Record<string, unknown>;
    const arr = data[key];
    if (!Array.isArray(arr)) return [slide];

    // Blockers: cap at 6, no pagination
    if (slide.type === "blockers") {
        if (arr.length > BLOCKERS_CAP) {
            console.warn(
                `[paginate] Blockers slide "${slide.title}" has ${arr.length} items; capping at ${BLOCKERS_CAP}.`
            );
        }
        return [{ ...slide, data: { ...data, [key]: arr.slice(0, BLOCKERS_CAP) } }];
    }

    // All other types: paginate at threshold
    const limit = slide.type === "grid" ? 6 : PAGINATION_THRESHOLD;
    if (arr.length <= limit) return [slide];

    const pages: LooseSlide[] = [];
    let pageNum = 0;
    while (pageNum * limit < arr.length) {
        const chunk = arr.slice(
            pageNum * limit,
            (pageNum + 1) * limit
        );
        const totalPages = Math.ceil(arr.length / limit);
        pages.push({
            ...slide,
            id: slide.id ? `${slide.id}-p${pageNum + 1}` : undefined,
            title: `${slide.title} ${pageNum + 1}/${totalPages}`,
            data: { ...data, [key]: chunk },
        });
        pageNum++;
    }
    return pages;
}

/**
 * Main pipeline:
 * 1. Apply density (trim arrays for executive mode)
 * 2. Paginate (split arrays > threshold into consecutive slides)
 * 3. Hide slides with empty arrays (except blockers zero-state)
 */
export function processSlides(
    slides: LooseSlide[],
    density: DensityMode
): LooseSlide[] {
    const result: LooseSlide[] = [];

    for (const slide of slides) {
        // Apply density first, then paginate
        const densityApplied = applyDensity(slide, density);
        const paginated = paginateSlide(densityApplied);

        for (const s of paginated) {
            // Hide slides with empty arrays (except blockers — renders zero-state)
            const key = ARRAY_KEYS[s.type];
            if (key && s.data) {
                const arr = (s.data as Record<string, unknown>)[key];
                if (Array.isArray(arr) && arr.length === 0 && s.type !== "blockers") {
                    continue; // hide
                }
            }
            result.push(s);
        }
    }

    return result;
}
