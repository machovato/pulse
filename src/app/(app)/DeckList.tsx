"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Play, Calendar, Trash2, Edit2, Loader2, Pin } from "lucide-react";
import { deleteDeck, renameDeck, togglePinDeck } from "@/app/actions";

const TEMPLATE_LABELS: Record<string, string> = {
    status: "Project Status",
    strategy: "Strategy",
    allHands: "All Hands",
    requirements: "Requirements",
    custom: "Custom",
    kickoff: "Launch Kickoff",
};

const BUTTON_STYLES: Record<string, string> = {
    status: "bg-[#1497E3] text-white hover:scale-105 hover:bg-blue-500 hover:shadow-lg hover:shadow-[#1497E3]/40 tracking-wide",
    strategy: "bg-[#003E6A] text-white hover:scale-105 hover:bg-[#005b9f] hover:shadow-lg hover:shadow-[#005b9f]/30 tracking-wide",
    kickoff: "bg-[#1E293B] text-[#C4652A] hover:scale-105 hover:bg-slate-800 hover:shadow-lg hover:shadow-[#1E293B]/40 tracking-wide",
    default: "bg-slate-500 text-white hover:scale-105 hover:bg-slate-600 hover:shadow-md tracking-wide",
};

const BUTTON_LABELS: Record<string, string> = {
    status: "Play Status",
    strategy: "Play Strategy",
    kickoff: "Play Kickoff",
    default: "Play Deck",
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

type DeckRow = {
    id: string;
    title: string;
    date: Date;
    template: string;
    rag: string | null;
    pinned: boolean;
    created_at: Date;
};

export function DeckList({ decks }: { decks: DeckRow[] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate versions implicitly by grouping titles over time
    const titleCounts: Record<string, number> = {};
    const decksWithVersion = [...decks]
        .map(d => ({ ...d, _ts: new Date(d.created_at).getTime() }))
        .sort((a, b) => a._ts - b._ts) // Sort oldest to newest
        .map(deck => {
            titleCounts[deck.title] = (titleCounts[deck.title] || 0) + 1;
            return {
                ...deck,
                version: titleCounts[deck.title],
                totalVersions: 0 // Will backfill
            };
        });

    // Backfill total versions so we only show "v2" if there's more than 1 version
    for (const d of decksWithVersion) {
        d.totalVersions = titleCounts[d.title];
    }

    // Re-sort newest to oldest for display
    decksWithVersion.sort((a, b) => b._ts - a._ts);

    const pinnedDecks = decksWithVersion.filter(d => d.pinned);
    const unpinnedDecks = decksWithVersion.filter(d => !d.pinned);

    const displayedUnpinned = isExpanded ? unpinnedDecks : unpinnedDecks.slice(0, 10);
    const hasMoreUnpinned = unpinnedDecks.length > 10;

    return (
        <div className="flex flex-col gap-8">
            {pinnedDecks.length > 0 && (
                <div className="flex flex-col gap-2.5">
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1 flex items-center gap-1.5"><Pin className="w-3.5 h-3.5" /> Pinned</p>
                    {pinnedDecks.map((deck) => (
                        <DeckRowItem key={deck.id} deck={deck} />
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-2.5">
                {pinnedDecks.length > 0 && unpinnedDecks.length > 0 && (
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Recent</p>
                )}
                {displayedUnpinned.map((deck) => (
                    <DeckRowItem key={deck.id} deck={deck} />
                ))}

                {hasMoreUnpinned && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 text-sm font-semibold text-[var(--dtn-blue)] hover:text-blue-700 transition-colors w-full py-2 hover:bg-blue-50/50 rounded-lg"
                    >
                        {isExpanded ? "Show less" : `View ${unpinnedDecks.length - 10} more`}
                    </button>
                )}
            </div>
        </div>
    );
}

function DeckRowItem({ deck }: { deck: DeckRow & { version: number, totalVersions: number } }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(deck.title);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPinning, setIsPinning] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const handleSave = async () => {
        if (!editValue.trim() || editValue === deck.title) {
            setIsEditing(false);
            setEditValue(deck.title);
            return;
        }

        setIsSaving(true);
        const res = await renameDeck(deck.id, editValue);
        if (res.success) {
            setIsEditing(false);
        } else {
            setEditValue(deck.title);
            setIsEditing(false);
            alert("Failed to rename the deck. Please try again.");
        }
        setIsSaving(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") {
            setEditValue(deck.title);
            setIsEditing(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm(`Are you sure you want to delete "${deck.title}"?`)) {
            setIsDeleting(true);
            const res = await deleteDeck(deck.id);
            if (res.success) {
                setDeleted(true);
            } else {
                alert("Failed to delete the deck. Please try again.");
            }
            setIsDeleting(false);
        }
    };

    const handlePin = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsPinning(true);
        const res = await togglePinDeck(deck.id, !deck.pinned);
        if (!res.success) {
            alert("Failed to update pin state.");
        }
        setIsPinning(false);
    };

    if (deleted) return null;

    const buttonStyle = BUTTON_STYLES[deck.template] || BUTTON_STYLES.default;
    const buttonLabel = BUTTON_LABELS[deck.template] || BUTTON_LABELS.default;

    return (
        <div className="card p-4 flex items-center gap-4 hover:shadow-md transition-all group relative">

            <Link href={`/deck/${deck.id}`} className={`w-[130px] px-2 py-2 ${buttonStyle} rounded-full shrink-0 relative z-10 flex items-center justify-center gap-1.5 font-medium text-sm transition-all duration-300`}>
                <Play className="w-4 h-4 fill-current" />
                {buttonLabel}
            </Link>

            <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleSave}
                                disabled={isSaving}
                                className="text-sm font-semibold text-[var(--color-text-heading)] border border-[var(--dtn-blue)] rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-[var(--dtn-blue)]/20"
                                onClick={(e) => e.stopPropagation()}
                            />
                            {isSaving && <Loader2 className="w-3 h-3 animate-spin text-gray-400" />}
                        </div>
                    ) : (
                        <p
                            className="text-sm font-semibold text-[var(--color-text-heading)] truncate cursor-pointer hover:text-[var(--dtn-blue)] transition-colors inline-flex items-center gap-1.5"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            title="Click to rename"
                        >
                            {deck.title}
                            {deck.totalVersions > 1 && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded leading-none">
                                    v{deck.version}
                                </span>
                            )}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] pointer-events-none">
                        <Calendar className="w-3 h-3" />
                        {formatDate(deck.date.toISOString())}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] bg-gray-50 border border-[var(--color-border)] rounded px-2 py-0.5 font-medium pointer-events-none">
                        {TEMPLATE_LABELS[deck.template] ?? deck.template}
                    </span>
                </div>
            </div>

            {deck.rag && (
                <span className={`rag-pill ${RAG_CLASSES[deck.rag] ?? ""} shrink-0 relative z-10 pointer-events-none`}>
                    <span className={`w-2 h-2 rounded-full ${RAG_DOTS[deck.rag] ?? ""}`} />
                    {RAG_LABELS[deck.rag] ?? deck.rag}
                </span>
            )}

            <div className="shrink-0 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity relative z-10">
                <button
                    onClick={handlePin}
                    disabled={isPinning}
                    className={`p-2 rounded-lg transition-colors ${deck.pinned ? 'text-[var(--dtn-blue)] bg-blue-50' : 'text-gray-400 hover:text-[var(--dtn-blue)] hover:bg-blue-50'}`}
                    title={deck.pinned ? "Unpin Deck" : "Pin Deck"}
                >
                    {isPinning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pin className={`w-4 h-4 ${deck.pinned ? 'fill-current transform rotate-45' : ''}`} />}
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                    className="p-2 text-gray-400 hover:text-[var(--dtn-blue)] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Rename Deck"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Deck"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
