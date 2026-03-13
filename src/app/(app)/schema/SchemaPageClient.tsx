"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SlideType } from "@/lib/schema";
import type { TEMPLATES } from "@/lib/templates";

interface SchemaPageClientProps {
    fullSchema: object;
    templateExamples: Record<string, object>;
    slideTypes: SlideType[];
    templates: typeof TEMPLATES;
}

const SLIDE_DESCRIPTIONS: Record<string, string> = {
    hero: "Opening slide with title, RAG pill, headline, and optional KPI tiles.",
    kpis: "2–4 stat tiles with icons, values, labels, and trend indicators.",
    pipeline: "Horizontal flow of steps with status, badges, and blocker chips.",
    grid: "Responsive 2×2 or 3×2 card grid with icons and body text.",
    timeline: "Gradient timeline bar with alternating milestone cards above/below.",
    blockers: "Severity-coded blocker cards. Zero items shows a green checkmark state.",
    callout: "Full-width high-contrast card for decisions, risks, quotes, or highlights.",
    agenda: "Numbered list with topic, time allocation, and owner chips.",
    decision_log: "Table of decisions with owner, date, and status badge.",
};

export function SchemaPageClient({ fullSchema, templateExamples, slideTypes, templates }: SchemaPageClientProps) {
    const [activeTab, setActiveTab] = useState<"full" | "status" | "allHands" | "requirements" | "custom">("status");
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [expandedSlides, setExpandedSlides] = useState<Record<string, boolean>>({});

    const handleCopy = (key: string, content: object) => {
        navigator.clipboard.writeText(JSON.stringify(content, null, 2));
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const toggleSlide = (type: string) => {
        setExpandedSlides((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const tabs: Array<{ id: typeof activeTab; label: string }> = [
        { id: "status", label: "Status" },
        { id: "allHands", label: "All Hands" },
        { id: "requirements", label: "Requirements" },
        { id: "custom", label: "Custom" },
        { id: "full", label: "Full Schema" },
    ];

    const currentExample = activeTab === "full" ? fullSchema : templateExamples[activeTab];

    return (
        <div className="max-w-5xl mx-auto w-full px-6 py-10">
            {/* Header */}
            <div className="mb-8">
                <p className="eyebrow mb-1">Contract</p>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">JSON Schema Reference</h1>
                <p className="text-[var(--text-secondary)] text-sm max-w-2xl">
                    This page is the live contract between the AI content generator and the presentation engine.
                    It is generated directly from the Zod validation schema — always in sync.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">
                {/* Left: Slide type reference */}
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Slide Types</h2>
                    <div className="space-y-2">
                        {slideTypes.map((type) => (
                            <div key={type} className="card overflow-hidden">
                                <button
                                    onClick={() => toggleSlide(type)}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <code className="text-sm font-mono font-semibold bg-blue-50 text-[var(--accent-primary)] px-2 py-0.5 rounded">
                                            {type}
                                        </code>
                                        <span className="text-sm text-[var(--text-secondary)]">
                                            {SLIDE_DESCRIPTIONS[type]}
                                        </span>
                                    </div>
                                    {expandedSlides[type] ? (
                                        <ChevronUp className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {expandedSlides[type] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden border-t border-[var(--card-border)]"
                                        >
                                            <SlideDataDocs type={type} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Template registry */}
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-4">Template Registry</h2>
                    <div className="space-y-3">
                        {Object.entries(templates).map(([id, cfg]) => (
                            <div key={id} className="card px-5 py-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <code className="text-sm font-mono font-semibold bg-navy-50 text-[var(--text-primary)] px-2 py-0.5 rounded bg-gray-100">
                                            {id}
                                        </code>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1">{cfg.description}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {cfg.allowed === "*"
                                        ? <span className="text-xs bg-purple-50 text-purple-600 border border-purple-100 rounded px-2 py-0.5 font-medium">all types allowed</span>
                                        : cfg.allowed.map((t) => (
                                            <span key={t} className="text-xs bg-blue-50 text-[var(--accent-primary)] border border-blue-100 rounded px-2 py-0.5 font-mono">{t}</span>
                                        ))
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: copyable examples */}
                <div className="sticky top-20 h-fit">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Copyable Examples</h2>
                    {/* Tabs */}
                    <div className="flex gap-1 mb-0 bg-gray-100 p-1 rounded-xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex-1 text-xs font-semibold py-1.5 px-2 rounded-lg transition-all",
                                    activeTab === tab.id
                                        ? "bg-white text-[var(--text-primary)] shadow-sm"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Code block */}
                    <div className="relative mt-0 card overflow-hidden rounded-t-none border-t-0">
                        <button
                            onClick={() => handleCopy(activeTab, currentExample)}
                            className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 text-xs font-medium bg-gray-800 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                            {copiedKey === activeTab ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedKey === activeTab ? "Copied!" : "Copy"}
                        </button>
                        <pre className="bg-gray-900 text-gray-100 text-xs p-5 overflow-auto max-h-[500px] font-mono leading-relaxed">
                            {JSON.stringify(currentExample, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SlideDataDocs({ type }: { type: string }) {
    const docs: Record<string, React.ReactNode> = {
        hero: <FieldTable fields={[
            { k: "subtitle", t: "string?", d: "Subtitle line below title" },
            { k: "headline", t: "string?", d: "Italic one-line summary" },
            { k: "rag", t: `"green"|"yellow"|"red"?`, d: "RAG status pill" },
            { k: "kpis", t: "KPIItem[]?", d: "Stat tiles row" },
        ]} />,
        kpis: <FieldTable fields={[
            { k: "items", t: "KPIItem[]", d: "label, value, icon?, trend?, note?" },
        ]} />,
        pipeline: <FieldTable fields={[
            { k: "steps", t: "Step[]", d: "label, status?, badges[]?, blockers[]?" },
        ]} />,
        grid: <FieldTable fields={[
            { k: "cards", t: "Card[]", d: "title, body, icon?" },
        ]} />,
        timeline: <FieldTable fields={[
            { k: "milestones", t: "Milestone[]", d: "label, date?, state, detail?" },
        ]} />,
        blockers: <FieldTable fields={[
            { k: "items", t: "BlockerItem[]", d: "text, severity, owner?, due?" },
        ]} />,
        callout: <FieldTable fields={[
            { k: "text", t: "string", d: "Main callout text (large)" },
            { k: "kind", t: `"decision"|"risk"|"quote"|"highlight"?`, d: "Visual style" },
            { k: "attribution", t: "string?", d: "Attribution line" },
        ]} />,
        agenda: <FieldTable fields={[
            { k: "items", t: "AgendaItem[]", d: "topic, time?, owner?" },
        ]} />,
        decision_log: <FieldTable fields={[
            { k: "items", t: "DecisionItem[]", d: "decision, owner?, date?, status?" },
        ]} />,
    };

    return (
        <div className="px-5 py-4 bg-gray-50">
            {docs[type] ?? <p className="text-xs text-[var(--text-secondary)] italic">No documentation available.</p>}
        </div>
    );
}

function FieldTable({ fields }: { fields: { k: string; t: string; d: string }[] }) {
    return (
        <table className="w-full text-xs">
            <thead>
                <tr className="text-left">
                    <th className="pb-1.5 pr-4 font-semibold text-[var(--text-secondary)] uppercase text-[10px] tracking-wider">Field</th>
                    <th className="pb-1.5 pr-4 font-semibold text-[var(--text-secondary)] uppercase text-[10px] tracking-wider">Type</th>
                    <th className="pb-1.5 font-semibold text-[var(--text-secondary)] uppercase text-[10px] tracking-wider">Description</th>
                </tr>
            </thead>
            <tbody>
                {fields.map(({ k, t, d }) => (
                    <tr key={k} className="border-t border-gray-100">
                        <td className="py-1.5 pr-4 font-mono text-[var(--accent-primary)] font-medium">{k}</td>
                        <td className="py-1.5 pr-4 font-mono text-rose-600">{t}</td>
                        <td className="py-1.5 text-[var(--text-secondary)]">{d}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
