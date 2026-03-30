import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/db";
import { LinkedInPostRenderer } from "@/components/LinkedInPostRenderer";

export const dynamic = "force-dynamic";

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props) {
    const record = await prisma.post.findUnique({ where: { id: params.id } });
    return {
        title: record
            ? `${record.hook.slice(0, 60)}… — Project Pulse`
            : "Post Not Found",
    };
}

export default async function PostPage({ params }: Props) {
    const record = await prisma.post.findUnique({ where: { id: params.id } });
    if (!record) notFound();

    return (
        <div className="min-h-screen bg-[var(--surface-primary)] px-6 py-8">
            <div className="max-w-[1100px] mx-auto">
            <Link
                href="/?tab=posts"
                className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors mb-6"
            >
                <ChevronLeft className="w-4 h-4" />
                Posts
            </Link>
            <LinkedInPostRenderer
                post={{
                    id: record.id,
                    project: record.project,
                    pillar: record.pillar,
                    theme: record.theme,
                    hook: record.hook,
                    body: record.body,
                    cta: record.cta,
                    hashtags: JSON.parse(record.hashtags || "[]"),
                    hook_char_count: record.hook_char_count,
                    total_char_count: record.total_char_count,
                    voice_version: record.voice_version,
                    status: record.status,
                    created_at: record.created_at.toISOString(),
                }}
            />
            </div>
        </div>
    );
}
