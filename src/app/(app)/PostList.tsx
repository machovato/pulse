"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Hash, Briefcase, Trash2, Loader2, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { deletePost, archivePost } from "@/app/actions";

// Platform icon: inline SVG for LinkedIn/X
function PlatformIcon({ platform, className = "w-5 h-5 fill-current" }: { platform: string; className?: string }) {
    if (platform === "X") {
        return (
            <svg viewBox="0 0 24 24" className={className} aria-label="X">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" className={className} aria-label="LinkedIn">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

const HOOK_LIMIT = 210;

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

export function PostList({ posts }: { posts: PostRow[] }) {
    const [activeFilter, setActiveFilter] = useState("all");

    // Derive unique platforms for filter tabs
    const platforms = Array.from(new Set(posts.map((p) => p.platform ?? "LinkedIn")));

    const filtered =
        activeFilter === "all"
            ? posts
            : posts.filter((p) => (p.platform ?? "LinkedIn") === activeFilter);

    const filters = [
        { id: "all", label: "All" },
        ...platforms.map((p) => ({ id: p, label: p })),
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Platform filter tabs */}
            {platforms.length > 0 && (
                <div className="flex items-center gap-1 border-b border-[var(--border-default)] mb-2 overflow-x-auto pb-px">
                    {filters.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                                activeFilter === tab.id
                                    ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Post rows */}
            <div className="flex flex-col gap-2">
                {filtered.map((post) => (
                    <PostRowItem key={post.id} post={post} />
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm font-medium">
                            No posts found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

const PLATFORM_STYLES: Record<string, { bg: string; text: string }> = {
    LinkedIn: { bg: "bg-[#0077B5]/10", text: "text-[#0077B5]" },
    X:        { bg: "bg-gray-100",     text: "text-gray-700"   },
};

function PostRowItem({ post }: { post: PostRow }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [gone, setGone] = useState(false);

    const hookOver = post.hook_char_count > HOOK_LIMIT;
    const platform = post.platform ?? "LinkedIn";
    const style = PLATFORM_STYLES[platform] ?? PLATFORM_STYLES.LinkedIn;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Delete this post permanently?")) {
            setIsDeleting(true);
            const res = await deletePost(post.id);
            if (res.success) setGone(true);
            else alert("Failed to delete the post.");
            setIsDeleting(false);
        }
    };

    const handleArchive = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsArchiving(true);
        const res = await archivePost(post.id);
        if (res.success) setGone(true);
        else alert("Failed to archive the post.");
        setIsArchiving(false);
    };

    if (gone) return null;

    return (
        <div className="card p-3 flex items-center gap-4 hover:shadow-md transition-all group relative">
            <Link href={`/posts/${post.id}`} className="absolute inset-0 z-0 rounded-xl" aria-label={`Open post: ${post.hook}`} />

            {/* Left: platform circle */}
            <div className="flex flex-col items-center justify-center shrink-0 w-16 gap-1.5 relative z-10 pointer-events-none">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${style.bg}`}>
                    <PlatformIcon platform={platform} className={`w-6 h-6 ${style.text}`} />
                </div>
                <span className={`text-[12px] font-medium leading-none ${style.text}`}>{platform}</span>
            </div>

            {/* Center: hook + meta */}
            <div className="flex-1 min-w-0 relative z-10 py-1 pl-1">
                <Link href={`/posts/${post.id}`} className="text-[15px] font-bold text-[var(--text-primary)] truncate hover:text-[var(--accent-primary)] transition-colors block">
                    {post.hook}
                </Link>
                <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
                    <span>{post.project}</span>
                    <span>·</span>
                    <span>{new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
            </div>

            {/* Badges */}
            <div className="shrink-0 hidden sm:flex items-center gap-2 relative z-10 pointer-events-none">
                <span className={cn(
                    "text-[11px] font-semibold px-2.5 py-1 rounded-full",
                    post.status === "Draft" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                )}>
                    {post.status}
                </span>
                <span className="text-[11px] font-medium text-[var(--text-secondary)] bg-slate-50 border border-slate-200 px-2 py-1 rounded-md font-mono tabular-nums">
                    {post.total_char_count} chars
                </span>
                <span className={cn(
                    "text-[11px] font-medium px-2 py-1 rounded-md font-mono tabular-nums border",
                    hookOver
                        ? "text-rose-600 bg-rose-50 border-rose-200"
                        : "text-[var(--text-secondary)] bg-slate-50 border-slate-200"
                )}>
                    hook {post.hook_char_count}/{HOOK_LIMIT}
                </span>
            </div>

            {/* Actions */}
            <div className="shrink-0 flex items-center gap-1 relative z-10 bg-white/80 backdrop-blur-sm rounded-lg pl-2">
                <button
                    onClick={handleArchive}
                    disabled={isArchiving}
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                    title="Archive post"
                >
                    {isArchiving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete post"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
