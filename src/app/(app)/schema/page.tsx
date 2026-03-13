import type { Metadata } from "next";
import { DeckSchema, SLIDE_TYPES } from "@/lib/schema";
import { TEMPLATES } from "@/lib/templates";
import { zodToJsonSchema } from "zod-to-json-schema";
import { SchemaPageClient } from "./SchemaPageClient";

export const metadata: Metadata = {
    title: "Schema Reference — Project Pulse",
    description: "Live JSON schema documentation for Project Pulse",
};

// This executes server-side at build/request time
function buildSchemaData() {
    const fullSchema = zodToJsonSchema(DeckSchema, { name: "Deck", target: "jsonSchema7" });

    // Per-template copyable examples
    const templateExamples: Record<string, object> = {
        status: {
            schemaVersion: 2,
            meta: {
                title: "Q1 Sprint Status",
                subtitle: "Engineering Team",
                date: "2026-03-04",
                audience: "exec",
                template: "status",
                rag: "green",
                headline: "Sprint velocity up 15%, zero P1 incidents.",
            },
            slides: [
                { type: "hero", title: "Q1 Sprint Status", data: { subtitle: "Week 9 of 13", rag: "green", kpis: [{ label: "Velocity", value: "42 pts", icon: "Zap", trend: "up" }] } },
                { type: "kpis", title: "Key Metrics", data: { items: [{ label: "Uptime", value: "99.97%", icon: "Activity", trend: "up" }, { label: "Latency", value: "84ms", icon: "Zap", trend: "flat" }] } },
                { type: "pipeline", title: "Delivery Pipeline", data: { steps: [{ label: "Discovery", status: "done" }, { label: "Dev", status: "current", badges: ["v2.1"] }, { label: "QA", status: "next" }] } },
                { type: "blockers", title: "Blockers", data: { items: [{ text: "Waiting on security sign-off", severity: "approval", owner: "J. Smith", due: "2026-03-07" }] } },
            ],
        },
        allHands: {
            schemaVersion: 2,
            meta: { title: "CX All Hands", date: "2026-03-04", audience: "team", template: "allHands", rag: "green" },
            slides: [
                { type: "hero", title: "CX All Hands — March 2026", data: { headline: "Strong quarter, eyes on H1 targets." } },
                { type: "agenda", title: "Today's Agenda", data: { items: [{ topic: "Q1 Results", time: "10 min", owner: "CEO" }, { topic: "Product Roadmap", time: "20 min", owner: "CPO" }, { topic: "Q&A", time: "15 min" }] } },
                { type: "callout", title: "Key Highlight", data: { text: "We crossed 10,000 active customers this quarter.", kind: "highlight" } },
            ],
        },
        requirements: {
            schemaVersion: 2,
            meta: { title: "API Requirements Review", date: "2026-03-04", audience: "mixed", template: "requirements" },
            slides: [
                { type: "hero", title: "API Requirements Review", data: { subtitle: "v3 Data Export API" } },
                { type: "agenda", title: "Session Agenda", data: { items: [{ topic: "Scope", time: "15 min" }, { topic: "Open Items", time: "30 min" }, { topic: "Decisions", time: "15 min" }] } },
                { type: "decision_log", title: "Decisions", data: { items: [{ decision: "Use OAuth 2.0 only", owner: "Arch Team", status: "approved" }, { decision: "Rate limit: 1000 req/min", status: "proposed" }] } },
            ],
        },
        custom: {
            schemaVersion: 2,
            meta: { title: "Custom Deck", date: "2026-03-04", audience: "mixed", template: "custom" },
            slides: [
                { type: "callout", title: "Opening Statement", data: { text: "Any slide type can appear in a custom deck.", kind: "highlight" } },
                { type: "timeline", title: "Project Timeline", data: { milestones: [{ label: "Kick-off", state: "done", date: "2026-01-06" }, { label: "Beta", state: "current", date: "2026-03-15" }, { label: "GA", state: "upcoming", date: "2026-05-01" }] } },
            ],
        },
    };

    return { fullSchema, templateExamples };
}

export default function SchemaPage() {
    const { fullSchema, templateExamples } = buildSchemaData();
    return (
        <SchemaPageClient
            fullSchema={fullSchema}
            templateExamples={templateExamples}
            slideTypes={SLIDE_TYPES}
            templates={TEMPLATES}
        />
    );
}
