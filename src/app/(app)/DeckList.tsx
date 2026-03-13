"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Play, Calendar, Trash2, Edit2, Loader2, Pin, Target, Activity, Rocket, FileText, Archive, Star, Code, Type } from "lucide-react";
import { deleteDeck, renameDeck, togglePinDeck, archiveDeck } from "@/app/actions";

const TEMPLATE_STYLES: Record<string, { bg: string, text: string, icon: React.FC<any> }> = {
    strategy: { bg: "bg-[var(--accent-template-strategy)]/15", text: "text-[var(--accent-template-strategy)]", icon: Target },
    status: { bg: "bg-[var(--accent-template-status)]/15", text: "text-[var(--accent-template-status)]", icon: Activity },
    kickoff: { bg: "bg-[var(--accent-template-kickoff)]/15", text: "text-[var(--accent-template-kickoff)]", icon: Rocket },
    default: { bg: "bg-[var(--surface-subtle)]/15", text: "text-[var(--text-secondary)]", icon: FileText },
};

const TEMPLATE_LABELS: Record<string, string> = {
    status: "Project Status",
    strategy: "Strategy",
    allHands: "All Hands",
    requirements: "Requirements",
    custom: "Custom",
    kickoff: "Launch Kickoff",
};

const RAG_STYLES: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    yellow: "bg-amber-50 text-amber-700 border border-amber-200",
    red: "bg-rose-50 text-rose-700 border border-rose-200",
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
    status: string;
    pinned: boolean;
    archived: boolean;
    created_at: Date;
    slideCount: number;
};

export function DeckList({ decks }: { decks: DeckRow[] }) {
    const [activeTab, setActiveTab] = useState("all");
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

    // Filter logic
    const activeDecks = decksWithVersion.filter(d => !d.archived);

    let filteredDecks = activeDecks;
    if (activeTab === "starred") {
        filteredDecks = activeDecks.filter(d => d.pinned);
    } else if (activeTab !== "all") {
        filteredDecks = activeDecks.filter(d => d.template === activeTab);
    }

    const pinnedDecks = activeTab === "all" ? filteredDecks.filter(d => d.pinned) : [];
    const unpinnedDecks = activeTab === "all" ? filteredDecks.filter(d => !d.pinned) : filteredDecks;

    const displayedUnpinned = isExpanded ? unpinnedDecks : unpinnedDecks.slice(0, 10);
    const hasMoreUnpinned = unpinnedDecks.length > 10;

    const tabs = [
        { id: "all", label: "All" },
        { id: "starred", label: "Starred" },
        { id: "strategy", label: "Strategy" },
        { id: "status", label: "Status" },
        { id: "kickoff", label: "Kickoff" },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-[var(--border-default)] mb-2 overflow-x-auto pb-px">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setIsExpanded(false); }}
                        className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300'}`}
                    >
                        {tab.label === "Starred" && <Star className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-8">
                {pinnedDecks.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1 flex items-center gap-1.5"><Pin className="w-3.5 h-3.5" /> Pinned</p>
                        {pinnedDecks.map((deck) => (
                            <DeckRowItem key={deck.id} deck={deck} />
                        ))}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {pinnedDecks.length > 0 && unpinnedDecks.length > 0 && (
                        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Recent</p>
                    )}
                    {displayedUnpinned.map((deck) => (
                        <DeckRowItem key={deck.id} deck={deck} />
                    ))}

                    {hasMoreUnpinned && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 text-sm font-semibold text-[var(--accent-primary)] hover:text-blue-700 transition-colors w-full py-2 hover:bg-blue-50/50 rounded-lg"
                        >
                            {isExpanded ? "Show less" : `View ${unpinnedDecks.length - 10} more`}
                        </button>
                    )}
                    
                    {filteredDecks.length === 0 && (
                         <div className="text-center py-12 flex flex-col items-center gap-3">
                             <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                 <FileText className="w-5 h-5 text-gray-400" />
                             </div>
                             <p className="text-[var(--text-secondary)] text-sm font-medium">
                                 No {activeTab !== "all" && activeTab !== "starred" ? activeTab : activeTab === "starred" ? "starred" : ""} decks found.
                             </p>
                         </div>
                    )}
                </div>
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
    const [isArchiving, setIsArchiving] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [archived, setArchived] = useState(false);

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

    const handleArchive = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm(`Archive "${deck.title}"? It will be removed from this list.`)) {
            setIsArchiving(true);
            const res = await archiveDeck(deck.id, true);
            if (res.success) {
                setArchived(true);
            } else {
                alert("Failed to archive the deck.");
            }
            setIsArchiving(false);
        }
    };

    if (deleted || archived) return null;

    const styleConfig = TEMPLATE_STYLES[deck.template] || TEMPLATE_STYLES.default;
    const IconComponent = styleConfig.icon;
    
    // Subtitle logic
    const templateLabel = TEMPLATE_LABELS[deck.template] ?? deck.template;
    const titleParts = deck.title.split(/ [-—] /);
    const projectName = titleParts.length > 1 ? titleParts[0] : "";
    const subtitle = projectName ? `${projectName} • ${templateLabel}` : templateLabel;

    return (
        <div className="card p-3 flex items-center gap-4 hover:shadow-md transition-all group relative">
            
            <Link href={`/deck/${deck.id}`} className="absolute inset-0 z-0 rounded-xl" aria-label={`Open ${deck.title}`}></Link>

            {/* Icon Treatment */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 pointer-events-none ${styleConfig.bg}`}>
                <IconComponent className={`w-5 h-5 ${styleConfig.text}`} />
            </div>

            {/* Title & Subtitle Stack */}
            <div className="flex-1 min-w-0 relative z-10 py-1">
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
                                className="text-sm font-bold text-[var(--text-primary)] border border-[var(--accent-primary)] rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 shadow-sm"
                                onClick={(e) => e.stopPropagation()}
                            />
                            {isSaving && <Loader2 className="w-3 h-3 animate-spin text-gray-400" />}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href={`/deck/${deck.id}`} className="text-[15px] font-bold text-[var(--text-primary)] truncate hover:text-[var(--accent-primary)] transition-colors">
                                {deck.title}
                            </Link>
                            {deck.totalVersions > 1 && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded leading-none pointer-events-none">
                                    v{deck.version}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--text-secondary)] pointer-events-none">
                        {subtitle}
                    </span>
                    <span className="text-gray-300 text-xs pointer-events-none">•</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)] pointer-events-none">
                        <Calendar className="w-3 h-3" />
                        {formatDate(deck.date.toISOString())}
                    </span>
                </div>
            </div>

            {/* Metadata Badges */}
            <div className="shrink-0 relative z-10 pointer-events-none hidden sm:flex items-center gap-2">
                {deck.rag && RAG_STYLES[deck.rag.toLowerCase()] && (
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${RAG_STYLES[deck.rag.toLowerCase()]}`}>
                        {RAG_LABELS[deck.rag.toLowerCase()] || deck.rag}
                    </span>
                )}
                <span className="text-[11px] font-medium text-[var(--text-secondary)] bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
                    {deck.slideCount} slide{deck.slideCount !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Actions Menu */}
            <div className={`shrink-0 flex items-center gap-1 opacity-100 ${!deck.pinned ? 'sm:opacity-0 sm:group-hover:opacity-100' : ''} transition-opacity bg-white/80 backdrop-blur-sm rounded-lg relative z-10 pl-2`}>
                <button
                    onClick={handlePin}
                    disabled={isPinning}
                    className={`p-2 rounded-md transition-colors ${deck.pinned ? 'text-[var(--accent-primary)] bg-blue-50' : 'text-gray-400 hover:text-[var(--accent-primary)] hover:bg-blue-50'}`}
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
                    className="p-2 text-gray-400 hover:text-[var(--accent-primary)] hover:bg-blue-50 rounded-md transition-colors"
                    title="Rename Deck"
                >
                    <Type className="w-4 h-4" />
                </button>
                <Link
                    href={`/editor?editId=${deck.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[var(--accent-primary)] hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit JSON Source"
                >
                    <Code className="w-4 h-4" />
                </Link>
                <button
                    onClick={handleArchive}
                    disabled={isArchiving}
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                    title="Archive Deck"
                >
                    {isArchiving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Deck permanently"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
