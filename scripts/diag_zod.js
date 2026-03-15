const { z } = require('zod');

const LooseSlideSchema = z.object({
    id: z.string().optional(),
    type: z.string(),
    title: z.string(),
    notes: z.string().optional(),
    data: z.record(z.unknown()).optional(),
    _missing: z.boolean().optional(),
    _reason: z.string().optional(),
    _hint: z.string().optional(),
});

const MetaSchema = z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
});

const LooseDeckSchema = z.object({
    schemaVersion: z.number().optional().default(1),
    meta: MetaSchema,
    slides: z.array(LooseSlideSchema),
});

const mock = {
    schemaVersion: 2,
    meta: {
        title: "Test",
        eyebrow: "Strategy Briefing"
    },
    slides: [
        {
            type: "context",
            title: "Where We Are",
            data: {
                eyebrow: "Current State",
                items: []
            }
        }
    ]
};

const result = LooseDeckSchema.safeParse(mock);
if (result.success) {
    console.log("Parsed Eyebrow:", result.data.slides[0].data?.eyebrow);
} else {
    console.error(result.error);
}
