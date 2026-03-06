import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import prisma from "@/lib/db";
import {
    PlusCircle,
    FileText,
    Calendar,
    ArrowRight,
    Keyboard,
} from "lucide-react";
import { DeckList } from "./DeckList";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "DTN Project Pulse — Presentation Engine",
    description: "Create and present project updates with the DTN meeting presentation engine.",
};

const TEMPLATE_LABELS: Record<string, string> = {
    status: "Project Status",
    allHands: "All Hands",
    requirements: "Requirements",
    custom: "Custom",
};

const RAG_CLASSES: Record<string, string> = {
    green: "rag-green",
    yellow: "rag-yellow",
    red: "rag-red",
};
const RAG_DOTS: Record<string, string> = {
    green: "bg-emerald-500",
    yellow: "bg-amber-400",
    red: "bg-rose-500",
};
const RAG_LABELS: Record<string, string> = {
    green: "On Track",
    yellow: "At Risk",
    red: "Off Track",
};

const SHORTCUTS = [
    { key: "← / →", action: "Navigate slides" },
    { key: "↑ / ↓", action: "Navigate slides" },
    { key: "N", action: "Speaker notes overlay" },
    { key: "G", action: "Slide grid overview" },
    { key: "D", action: "Toggle Executive / Full density" },
    { key: "P", action: "Print / export to PDF" },
    { key: "E", action: "Return to home" },
    { key: "Shift + E", action: "Edit current deck" },
    { key: "Esc", action: "Dismiss overlay" },
];

const BLANK_SCAFFOLD = JSON.stringify(
    {
        schemaVersion: 1,
        meta: {
            title: "Untitled Deck",
            date: new Date().toISOString().split("T")[0],
            audience: "team",
            template: "status",
        },
        slides: [
            {
                type: "hero",
                title: "Project Name",
                data: {
                    subtitle: "Team · Date",
                    rag: "green",
                    kpis: [],
                },
            },
        ],
    },
    null,
    2
);

export default async function HomePage() {
    const decks = await prisma.update.findMany({
        orderBy: { created_at: "desc" },
        select: {
            id: true,
            title: true,
            date: true,
            template: true,
            rag: true,
            pinned: true,
            created_at: true,
        },
    });

    const editorHref = `/editor?prefill=${encodeURIComponent(BLANK_SCAFFOLD)}`;

    return (
        <div className="max-w-4xl mx-auto w-full px-6 py-10 flex flex-col gap-12">

            {/* ── Hero header ── */}
            <div className="flex items-start justify-between gap-6">
                <div>
                    <p className="eyebrow mb-1">DTN Project Pulse</p>
                    <h1
                        className="font-bold text-[var(--color-text-heading)]"
                        style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
                    >
                        Presentation Engine
                    </h1>
                    <p className="text-[var(--color-text-muted)] mt-1.5 text-sm max-w-sm">
                        JSON-driven meeting decks. Every publish is an immutable record.
                    </p>
                </div>

                {/* New Deck CTA */}
                <Link
                    href={editorHref}
                    id="new-deck-btn"
                    className="inline-flex items-center gap-2 bg-[var(--dtn-blue)] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[var(--dtn-blue-mid)] transition-colors shadow-sm shrink-0 group"
                >
                    <PlusCircle className="w-4 h-4" />
                    New Deck
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* ── Deck list ── */}
            <section>
                <div className="flex items-baseline gap-3 mb-4">
                    <h2 className="text-lg font-bold text-[var(--color-text-heading)]">
                        Published Decks
                    </h2>
                    <span className="text-xs text-[var(--color-text-muted)] font-medium">
                        {decks.length} record{decks.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {decks.length === 0 ? (
                    <EmptyState editorHref={editorHref} />
                ) : (
                    <DeckList decks={decks} />
                )}
            </section>

            {/* ── Quick links ── */}
            <section className="flex gap-3 flex-wrap">
                <Link
                    href="/schema"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--dtn-blue)] border border-[var(--color-border)] rounded-lg px-3 py-2 transition-colors"
                >
                    JSON Schema Reference
                </Link>
                <Link
                    href="/editor"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--dtn-blue)] border border-[var(--color-border)] rounded-lg px-3 py-2 transition-colors"
                >
                    Editor
                </Link>
            </section>

            {/* ── Keyboard shortcuts ── */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Keyboard className="w-4 h-4 text-[var(--dtn-blue)]" />
                    <h2 className="text-sm font-bold text-[var(--color-text-heading)] uppercase tracking-wider">
                        Keyboard Shortcuts
                    </h2>
                    <span className="text-xs text-[var(--color-text-muted)]">— presentation mode</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SHORTCUTS.map(({ key, action }) => (
                        <div
                            key={key}
                            className="card p-3 flex flex-col gap-1.5"
                        >
                            <kbd className="inline-block bg-gray-50 border border-[var(--color-border)] text-[var(--dtn-blue)] text-[11px] font-mono font-bold px-2 py-0.5 rounded w-fit">
                                {key}
                            </kbd>
                            <span className="text-xs text-[var(--color-text-muted)] leading-snug">{action}</span>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}

function EmptyState({ editorHref }: { editorHref: string }) {
    return (
        <div className="card p-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-[var(--dtn-blue)]" />
            </div>
            <div>
                <p className="text-lg font-bold text-[var(--color-text-heading)] mb-1">No decks yet</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Create your first presentation deck to get started.
                </p>
            </div>
            <Link
                href={editorHref}
                className="inline-flex items-center gap-2 bg-[var(--dtn-blue)] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[var(--dtn-blue-mid)] transition-colors"
            >
                <PlusCircle className="w-4 h-4" />
                New Deck
            </Link>
        </div>
    );
}
