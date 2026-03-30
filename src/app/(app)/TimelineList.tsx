"use client";

import { Activity, Pin } from "lucide-react";
import { DeckRowItem } from "./DeckList";
import { PostRowItem } from "./PostList";

type TimelineItem = 
    | { type: "deck"; data: any; ts: number; pinned: boolean }
    | { type: "post"; data: any; ts: number; pinned: boolean };

export function TimelineList({ decks, posts }: { decks: any[]; posts: any[] }) {
    // 1. Calculate Deck versions
    const titleCounts: Record<string, number> = {};
    const versionKey = (d: any) => `${d.title}::${d.template}`;
    const decksWithVersion = [...decks]
        .map(d => ({ ...d, _ts: new Date(d.created_at).getTime() }))
        .sort((a, b) => a._ts - b._ts)
        .map(deck => {
            const key = versionKey(deck);
            titleCounts[key] = (titleCounts[key] || 0) + 1;
            return {
                ...deck,
                version: titleCounts[key],
                totalVersions: 0
            };
        });

    for (const d of decksWithVersion) {
        d.totalVersions = titleCounts[versionKey(d)];
    }

    // 2. Merge into Timeline array
    const timelineItems: TimelineItem[] = [
        ...decksWithVersion.filter(d => !d.archived).map(d => ({
            type: "deck" as const,
            data: d,
            ts: d._ts,
            pinned: d.pinned
        })),
        ...posts.map(p => ({
            type: "post" as const,
            data: p,
            ts: new Date(p.created_at).getTime(),
            pinned: p.pinned
        }))
    ];

    // 3. Sort by pinned, then by date descending
    timelineItems.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.ts - a.ts;
    });

    if (timelineItems.length === 0) {
        return (
            <div className="text-center py-12 flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-[var(--text-secondary)] text-sm font-medium">
                    No activity yet.
                </p>
            </div>
        );
    }

    const pinnedItems = timelineItems.filter(item => item.pinned);
    const recentItems = timelineItems.filter(item => !item.pinned);

    return (
        <div className="flex flex-col gap-8">
            {pinnedItems.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1 flex items-center gap-1.5"><Pin className="w-3.5 h-3.5" /> Pinned</p>
                    {pinnedItems.map((item) => {
                        if (item.type === "deck") {
                            return <DeckRowItem key={`deck-${item.data.id}`} deck={item.data} isTimelineView={true} />;
                        } else {
                            return <PostRowItem key={`post-${item.data.id}`} post={item.data} isTimelineView={true} />;
                        }
                    })}
                </div>
            )}

            <div className="flex flex-col gap-2">
                {pinnedItems.length > 0 && recentItems.length > 0 && (
                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Recent</p>
                )}
                {recentItems.map((item) => {
                    if (item.type === "deck") {
                        return <DeckRowItem key={`deck-${item.data.id}`} deck={item.data} isTimelineView={true} />;
                    } else {
                        return <PostRowItem key={`post-${item.data.id}`} post={item.data} isTimelineView={true} />;
                    }
                })}
            </div>
        </div>
    );
}
