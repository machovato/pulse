"use client";

import { useState, useEffect } from "react";
import { Presentation, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeckList } from "./DeckList";
import { PostList } from "./PostList";

type DeckRow = {
    id: string;
    title: string;
    date: Date;
    template: string;
    rag: string | null;
    status: string;
    pinned: boolean;
    archived: boolean;
    created_at: Date;
    slideCount: number;
    theme?: string | null;
    eyebrow?: string | null;
    project?: string | null;
};

type PostRow = {
    id: string;
    project: string;
    pillar: string;
    theme: string;
    hook: string;
    hook_char_count: number;
    total_char_count: number;
    platform?: string;
    status: string;
    created_at: Date;
};

const ARTIFACT_TABS = [
    { id: "decks", label: "Decks", icon: Presentation },
    { id: "posts", label: "Posts", icon: PenLine },
] as const;

type TabId = (typeof ARTIFACT_TABS)[number]["id"];

export function ArtifactTabs({
    decks,
    posts,
    deckCount,
    postCount,
}: {
    decks: DeckRow[];
    posts: PostRow[];
    deckCount: number;
    postCount: number;
}) {
    const [activeTab, setActiveTab] = useState<TabId>("decks");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        if (tab === "posts" || tab === "decks") setActiveTab(tab);
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Top-level artifact type tabs */}
            <div className="flex items-center gap-1 border-b border-[var(--border-default)] pb-px">
                {ARTIFACT_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const count = tab.id === "decks" ? deckCount : postCount;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                                activeTab === tab.id
                                    ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            <span
                                className={cn(
                                    "text-[11px] font-medium px-1.5 py-0.5 rounded-full",
                                    activeTab === tab.id
                                        ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                                        : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
                                )}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            {activeTab === "decks" && <DeckList decks={decks} />}
            {activeTab === "posts" && <PostList posts={posts} />}
        </div>
    );
}
