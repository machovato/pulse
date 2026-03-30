import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: params.id },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: post.id,
            project: post.project,
            pillar: post.pillar,
            theme: post.theme,
            hook: post.hook,
            body: post.body,
            cta: post.cta,
            hashtags: JSON.parse(post.hashtags || "[]"),
            hook_char_count: post.hook_char_count,
            total_char_count: post.total_char_count,
            voice_version: post.voice_version,
            status: post.status,
            created_at: post.created_at.toISOString(),
        });
    } catch (error: any) {
        console.error("[API] Get Post Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
