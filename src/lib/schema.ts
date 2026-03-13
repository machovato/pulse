import { z } from "zod";

// ─── Shared primitives ───────────────────────────────────────────────────────

const RAGSchema = z.enum(["green", "yellow", "red"]);
const TrendSchema = z.enum(["up", "down", "flat"]);

const KPIItemSchema = z.object({
    label: z.string(),
    value: z.string(),
    icon: z.string().optional(),
    trend: TrendSchema.optional(),
    note: z.string().optional(),
});

// ─── Slide data schemas ───────────────────────────────────────────────────────

const HeroDataSchema = z.object({
    eyebrow: z.string().optional(),
    subtitle: z.string().optional(),
    headline: z.string().optional(),
    rag: RAGSchema.optional(),
    kpis: z
        .array(
            z.object({
                label: z.string(),
                value: z.string(),
                icon: z.string().optional(),
                trend: TrendSchema.optional(),
            })
        )
        .optional(),
});

const KpisDataSchema = z.object({
    eyebrow: z.string().optional(),
    items: z.array(KPIItemSchema),
});

const PipelineDataSchema = z.object({
    eyebrow: z.string().optional(),
    steps: z.array(
        z.object({
            label: z.string(),
            icon: z.string().optional(),
            status: z.enum(["done", "current", "next"]).optional(),
            badges: z.array(z.string()).optional(),
            blockers: z.array(z.string()).optional(),
        })
    ),
});

const GridDataSchema = z.object({
    eyebrow: z.string().optional(),
    cards: z.array(
        z.object({
            title: z.string(),
            body: z.string(),
            icon: z.string().optional(),
        })
    ),
});

const TimelineDataSchema = z.object({
    eyebrow: z.string().optional(),
    milestones: z.array(
        z.object({
            label: z.string(),
            date: z.string().optional(),
            state: z.enum(["done", "current", "upcoming"]),
            detail: z.string().optional(),
        })
    ),
    progress: z.object({
        completed: z.number(),
        total: z.number(),
        percent: z.number(),
    }).optional(),
});

const BlockersDataSchema = z.object({
    eyebrow: z.string().optional(),
    summary: z.object({
        actions: z.number().optional(),
        approvals: z.number().optional(),
        fyis: z.number().optional(),
    }).optional(),
    items: z.array(
        z.object({
            text: z.string(),
            severity: z.enum(["action", "approval", "fyi"]),
            owner: z.string().optional(),
            due: z.string().optional(),
            priority: z.enum(["high", "standard"]).optional(),
            badges: z.array(z.string()).optional(),
        })
    ),
});

const CalloutDataSchema = z.object({
    eyebrow: z.string().optional(),
    text: z.string(),
    kind: z.enum(["decision", "risk", "quote", "highlight"]).optional(),
    attribution: z.string().optional(),
});

const AgendaDataSchema = z.object({
    eyebrow: z.string().optional(),
    items: z.array(
        z.object({
            topic: z.string(),
            time: z.string().optional(),
            owner: z.string().optional(),
        })
    ),
});

const DecisionLogDataSchema = z.object({
    eyebrow: z.string().optional(),
    items: z.array(
        z.object({
            decision: z.string(),
            owner: z.string().optional(),
            date: z.string().optional(),
            status: z
                .enum(["proposed", "approved", "blocked", "done"])
                .optional(),
        })
    ),
});

// ─── V2 Strategy Slide Data schemas ──────────────────────────────────────────

const V2ContextDataSchema = z.object({
    eyebrow: z.string().optional(),
    items: z.array(
        z.object({
            title: z.string(),
            body: z.string(),
            icon: z.string(),
            status: z.enum(["confirmed", "in-progress", "pending"]),
        })
    ),
});

const V2ProblemDataSchema = z.object({
    eyebrow: z.string().optional(),
    primary: z.object({
        title: z.string(),
        body: z.string(),
        icon: z.string(),
        severity: z.enum(["critical", "high", "moderate"]),
    }),
    secondary: z.array(
        z.object({
            title: z.string(),
            body: z.string(),
            icon: z.string(),
            severity: z.enum(["critical", "high", "moderate"]),
        })
    ),
});

const V2EvidenceDataSchema = z.object({
    eyebrow: z.string().optional(),
    points: z.array(
        z.object({
            metric: z.string(),
            label: z.string(),
            source: z.string(),
            type: z.enum(["quantified", "qualitative"]),
            body: z.string(),
        })
    ),
});

const V2FrameworkDataSchema = z.object({
    eyebrow: z.string().optional(),
    lanes: z.array(
        z.object({
            title: z.string(),
            body: z.string(),
            icon: z.string(),
            type: z.enum(["control", "influence", "concern"]),
            rank: z.number(),
        })
    ),
});

// ─── Base slide fields ────────────────────────────────────────────────────────

const BaseSlideSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    notes: z.string().optional(),
});

// ─── Discriminated union ──────────────────────────────────────────────────────

export const V1SlideSchema = z.discriminatedUnion("type", [
    BaseSlideSchema.extend({ type: z.literal("hero"), data: HeroDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("kpis"), data: KpisDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("pipeline"), data: PipelineDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("grid"), data: GridDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("timeline"), data: TimelineDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("blockers"), data: BlockersDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("callout"), data: CalloutDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("agenda"), data: AgendaDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("decision_log"), data: DecisionLogDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("context"), data: GridDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("problem"), data: GridDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("evidence"), data: GridDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("framework"), data: GridDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("roadmap"), data: TimelineDataSchema }),
]);

export const V2SlideSchema = z.discriminatedUnion("type", [
    BaseSlideSchema.extend({ type: z.literal("hero"), data: HeroDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("kpis"), data: KpisDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("pipeline"), data: PipelineDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("grid"), data: GridDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("timeline"), data: TimelineDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("blockers"), data: BlockersDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("callout"), data: CalloutDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("agenda"), data: AgendaDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("decision_log"), data: DecisionLogDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("context"), data: V2ContextDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("problem"), data: V2ProblemDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("evidence"), data: V2EvidenceDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("framework"), data: V2FrameworkDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("roadmap"), data: TimelineDataSchema }),
]);

export const SlideSchema = z.union([V1SlideSchema, V2SlideSchema]);
export type Slide = z.infer<typeof SlideSchema>;
export type SlideType = z.infer<typeof V1SlideSchema>["type"] | z.infer<typeof V2SlideSchema>["type"];

// A relaxed version for unknown types — used in the renderer fallback
export const LooseSlideSchema = z.object({
    id: z.string().optional(),
    type: z.string(),
    title: z.string(),
    notes: z.string().optional(),
    data: z.record(z.unknown()).optional(),
});
export type LooseSlide = z.infer<typeof LooseSlideSchema>;

// ─── Meta schema ─────────────────────────────────────────────────────────────

export const MetaSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    audience: z.enum(["exec", "team", "customer", "mixed"]),
    template: z.enum(["status", "allHands", "requirements", "strategy", "custom", "kickoff"]),
    theme: z.string().optional(),
    rag: RAGSchema.optional(),
    headline: z.string().optional(),
    eyebrow: z.string().optional(),
});

export type Meta = z.infer<typeof MetaSchema>;

// ─── Full deck schema ─────────────────────────────────────────────────────────

export const V1DeckSchema = z.object({
    schemaVersion: z.literal(1).optional().default(1),
    meta: MetaSchema,
    slides: z.array(V1SlideSchema),
});

export const V2DeckSchema = z.object({
    schemaVersion: z.literal(2),
    meta: MetaSchema,
    slides: z.array(V2SlideSchema),
});

export const DeckSchema = z.preprocess(
    (val: any) => {
        if (typeof val === "object" && val !== null && !("schemaVersion" in val)) {
            return { ...val, schemaVersion: 2 };
        }
        return val;
    },
    z.discriminatedUnion("schemaVersion", [
        V1DeckSchema,
        V2DeckSchema,
    ])
);

export type Deck = z.infer<typeof DeckSchema>;

// ─── Loose deck (for parsing with unknown slide types) ────────────────────────

export const LooseDeckSchema = z.object({
    schemaVersion: z.number().optional().default(1),
    meta: MetaSchema,
    slides: z.array(LooseSlideSchema),
});

export type LooseDeck = z.infer<typeof LooseDeckSchema>;

// ─── Exports for schema page ──────────────────────────────────────────────────

export const SLIDE_TYPES: SlideType[] = [
    "hero",
    "kpis",
    "pipeline",
    "grid",
    "timeline",
    "blockers",
    "callout",
    "agenda",
    "decision_log",
    "context",
    "problem",
    "evidence",
    "framework",
    "roadmap",
];

export const RAG_VALUES = ["green", "yellow", "red"] as const;
export type RAG = (typeof RAG_VALUES)[number];
