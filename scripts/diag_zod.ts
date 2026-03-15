import { LooseDeckSchema } from '../src/lib/schema';

const mock = {
    schemaVersion: 2,
    meta: {
        title: "Test",
        date: "2026-03-15",
        audience: "team",
        template: "strategy"
    },
    slides: [
        {
            type: "context",
            title: "Test Title",
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
