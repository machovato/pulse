import Link from "next/link";
import prisma from "@/lib/db";
import { ArrowLeft, FileText, Hash, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "LinkedIn Drafts — Project Pulse",
};

const HOOK_LIMIT = 210;

export default async function PostsIndexPage() {
    const posts = await prisma.post.findMany({
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
    });

    return (
        <div className="max-w-4xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] mb-3 transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Pulse
                    </Link>
                    <p className="eyebrow mb-1">Project Pulse</p>
                    <h1
                        className="font-bold text-[var(--text-primary)]"
                        style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
                    >
                        LinkedIn Drafts
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1.5 text-sm max-w-sm">
                        AI-generated post drafts from your project vault.
                    </p>
                </div>
                <span className="text-xs text-[var(--text-secondary)] font-medium mt-2">
                    {posts.length} draft{posts.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Post list */}
            {posts.length === 0 ? (
                <div className="card p-12 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <FileText className="w-8 h-8 text-[var(--accent-primary)]" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-[var(--text-primary)] mb-1">
                            No drafts yet
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Run the <code className="bg-[var(--surface-secondary)] px-1.5 py-0.5 rounded text-xs">/linkedin</code> skill to generate your first post.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {posts.map((post) => {
                        const hookOver = post.hook_char_count > HOOK_LIMIT;
                        return (
                            <Link
                                key={post.id}
                                href={`/posts/${post.id}`}
                                className="card p-5 flex flex-col gap-3 hover:border-[var(--accent-primary)] hover:shadow-md transition-all group"
                            >
                                {/* Top row: labels */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] bg-[var(--surface-secondary)] px-2 py-1 rounded">
                                        <Briefcase className="w-3 h-3" />
                                        {post.project}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] bg-[var(--surface-secondary)] px-2 py-1 rounded">
                                        <Hash className="w-3 h-3" />
                                        {post.pillar}
                                    </span>
                                    <span className={cn(
                                        "ml-auto text-[11px] font-semibold px-2 py-0.5 rounded",
                                        post.status === "Draft"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-emerald-100 text-emerald-700"
                                    )}>
                                        {post.status}
                                    </span>
                                </div>

                                {/* Hook preview */}
                                <p className="text-sm font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
                                    {post.hook}
                                </p>

                                {/* Bottom row: meta */}
                                <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
                                    <span>{post.theme}</span>
                                    <span>·</span>
                                    <span className="font-mono tabular-nums">
                                        {post.total_char_count} chars
                                    </span>
                                    <span>·</span>
                                    <span className={cn(
                                        "font-mono tabular-nums",
                                        hookOver ? "text-rose-500 font-bold" : ""
                                    )}>
                                        hook: {post.hook_char_count}/{HOOK_LIMIT}
                                    </span>
                                    <span className="ml-auto">
                                        {new Date(post.created_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
