import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/db";
import {
    PlusCircle,
    FileText,
    ArrowRight,
    Keyboard,
    Archive,
} from "lucide-react";
import { ArtifactTabs } from "./ArtifactTabs";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Project Pulse",
    description: "Multi-format artifact engine — decks, posts, and more.",
};

const SHORTCUTS = [
    { key: "← / → / ↑ / ↓", action: "Navigate slides" },
    { key: "N", action: "Speaker notes overlay" },
    { key: "O / G", action: "Slide grid overview" },
    { key: "E", action: "Edit this slide" },
    { key: "Shift + E", action: "Edit entire deck" },
    { key: "D", action: "Toggle Executive / Full density" },
    { key: "P", action: "Print / export to PDF" },
    { key: "Esc", action: "Dismiss overlay / Return to home" },
];

const BLANK_SCAFFOLD = JSON.stringify(
    {
        schemaVersion: 2,
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
    // Fetch both artifact types in parallel
    const [rawDecks, rawPosts] = await Promise.all([
        prisma.update.findMany({
            orderBy: { created_at: "desc" },
            select: {
                id: true,
                title: true,
                date: true,
                template: true,
                rag: true,
                status: true,
                pinned: true,
                archived: true,
                created_at: true,
                content_json: true,
            },
        }),
        prisma.post.findMany({
            where: { archived: false },
            orderBy: { created_at: "desc" },
            select: {
                id: true,
                project: true,
                pillar: true,
                theme: true,
                hook: true,
                hook_char_count: true,
                total_char_count: true,
                status: true,
                created_at: true,
            },
        }),
    ]);

    const decks = rawDecks.map(deck => {
        let slideCount = 0;
        let ragOverride = deck.rag;
        let theme = null;
        let project = null;
        let eyebrow = null;
        try {
            const parsed = JSON.parse(deck.content_json);
            slideCount = Array.isArray(parsed.slides) ? parsed.slides.length : 0;
            if (parsed.meta?.rag) ragOverride = parsed.meta.rag;
            if (parsed.meta?.theme) theme = parsed.meta.theme;
            if (parsed.meta?.project) project = parsed.meta.project;
            if (parsed.meta?.eyebrow) eyebrow = parsed.meta.eyebrow;
        } catch (e) {
            // ignore
        }
        return {
            id: deck.id,
            title: deck.title,
            date: deck.date,
            template: deck.template,
            rag: ragOverride,
            status: deck.status,
            pinned: deck.pinned,
            archived: deck.archived,
            created_at: deck.created_at,
            slideCount,
            theme,
            project,
            eyebrow,
        };
    });

    const activeDecks = decks.filter(d => !d.archived);
    const editorHref = `/editor?prefill=${encodeURIComponent(BLANK_SCAFFOLD)}`;

    return (
        <div className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col gap-12">

            {/* ── Hero header ── */}
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h1
                        className="font-bold text-[var(--text-primary)]"
                        style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
                    >
                        Artifact Hub
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1.5 text-sm">
                        Structured content from your vault — decks, posts, and more.
                    </p>
                </div>

                <Link
                    href={editorHref}
                    id="new-deck-btn"
                    className="inline-flex items-center gap-2 bg-[var(--accent-primary)] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[var(--accent-primary-bg)] transition-colors shadow-sm shrink-0 group"
                >
                    <PlusCircle className="w-4 h-4" />
                    New Deck
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* ── Artifact tabs (Decks | Posts) ── */}
            <section>
                <ArtifactTabs
                    decks={decks}
                    posts={rawPosts}
                    deckCount={activeDecks.length}
                    postCount={rawPosts.length}
                />
            </section>

            {/* ── Bottom Navigation ── */}
            <section className="grid grid-cols-1 gap-4">
                <Link href="/archive" className="card p-4 flex items-center gap-4 hover:border-[var(--accent-primary)] hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Archive className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">Archive</h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">View past presentations</p>
                    </div>
                </Link>
            </section>

            {/* ── Quick links ── */}
            <section className="flex gap-3 flex-wrap">
                <Link
                    href="/schema"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border border-[var(--border-default)] rounded-lg px-3 py-2 transition-colors"
                >
                    JSON Schema Reference
                </Link>
                <Link
                    href="/editor"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border border-[var(--border-default)] rounded-lg px-3 py-2 transition-colors"
                >
                    Editor
                </Link>
            </section>

            {/* ── Keyboard shortcuts ── */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Keyboard className="w-4 h-4 text-[var(--accent-primary)]" />
                    <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        Keyboard Shortcuts
                    </h2>
                    <span className="text-xs text-[var(--text-secondary)]">— presentation mode</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SHORTCUTS.map(({ key, action }) => (
                        <div
                            key={key}
                            className="card p-3 flex flex-col gap-1.5"
                        >
                            <kbd className="inline-block bg-gray-50 border border-[var(--border-default)] text-[var(--accent-primary)] text-[11px] font-mono font-bold px-2 py-0.5 rounded w-fit">
                                {key}
                            </kbd>
                            <span className="text-xs text-[var(--text-secondary)] leading-snug">{action}</span>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
